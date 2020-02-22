import React from 'react';

import papa from 'papaparse';
import shortid from 'shortid';
import { GearList, Starred, Unit, GearListCategory, GearItem } from '../types';
import cloneDeep from 'clone-deep';
import isUrl from 'is-url';
import { getNextColor, convertUnitToListType, isNumeric, toGrams, fromGrams, toFixed } from '../utils';
import { actions } from '../reducers';
import { useDispatch } from 'react-redux';
import { createBlankList } from '../reducers/GearLists';
import { useAppSelector } from '../store';

interface FileUploadInputProps {
  list?: GearList;
  onUploadComplete?: (list: GearList) => void;
}

function convertUnit(inputUnit: string): Unit {
  const unit = inputUnit.toLowerCase();

  if (['oz', 'ounce'].includes(unit)) return 'oz';

  if (['lb', 'pound'].includes(unit)) return 'lb';

  if (['kg', 'kilogram'].includes(unit)) return 'kg';

  return 'g';
}

function validateStar(inputStar: string | undefined): Starred {
  if (!inputStar) return 'none';

  if (['red', 'green', 'blue'].includes(inputStar)) {
    return inputStar as Starred;
  }

  return 'none';
}

function stringToBool(value = '') {
  const val = value.toLowerCase();

  if (val === 'true') {
    return true;
  }

  if (val === 'false') {
    return false;
  }

  return !!val;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({
  list,
  onUploadComplete,
}) => {
  const dispatch = useDispatch();

  const userId = useAppSelector(state => state.user.id);

  return (
    <input
      onChange={(e: any) => {
        try {
          const reader = new FileReader();
          reader.onloadend = e => {
            const content = reader.result;
            const result = papa.parse(content as string);

            if (result.data.length === 0) {
              return alert('File is empty');
            }

            const headers = result.data[0].map(header => header.toLowerCase());

            const wasColumnFound = result.data[0].map(header => false);

            const name_col: number = headers.findIndex((header, index) => {
              const match = header.includes('name');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });

            const category_col: number = headers.findIndex((header, index) => {
              const match = header.includes('category');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const desc_col: number = headers.findIndex((header, index) => {
              const match = header.includes('desc');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const weight_col: number = headers.findIndex((header, index) => {
              const match = header.includes('weight');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const unit_col: number = headers.findIndex((header, index) => {
              const match = header.includes('unit');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const url_col: number = headers.findIndex((header, index) => {
              const match =
                header.includes('url') || header.includes('hyperlink');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const price_col: number = headers.findIndex((header, index) => {
              const match = header.includes('price');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const worn_col: number = headers.findIndex((header, index) => {
              const match = header.includes('worn');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const consumable_col: number = headers.findIndex(
              (header, index) => {
                const match = header.includes('consumable');
                if (match) {
                  wasColumnFound[index] = true;
                }
                return match;
              }
            );
            const checked_col: number = headers.findIndex((header, index) => {
              const match = header.includes('checked');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });
            const starred_col: number = headers.findIndex((header, index) => {
              const match = header.includes('starred');
              if (match) {
                wasColumnFound[index] = true;
              }
              return match;
            });

            if (
              name_col === -1 &&
              category_col === -1 &&
              desc_col === -1 &&
              weight_col === -1 &&
              unit_col === -1 &&
              url_col === -1 &&
              price_col === -1 &&
              worn_col === -1 &&
              consumable_col === -1 &&
              checked_col === -1 &&
              starred_col === -1
            ) {
              return alert('No columns found');
            }

            const listClone: GearList = list
              ? cloneDeep(list)
              : createBlankList({
                  listId: 'new copy',
                  userId,
                  preferredUnitType: 'imperial',
                });

            let existingCategoryNames = listClone.categoryIds.map(catId => ({
              name: listClone.categories[catId].name.toLowerCase(),
              id: catId,
            }));

            for (let i = 1; i < result.data.length; i++) {
              const row: string[] = result.data[i];

              if (row.length <= 1) {
                continue;
              }
              const category = row[category_col] || 'unknown category';

              const categoryExistsAlreadyIndex = existingCategoryNames.findIndex(
                catNameAndId => catNameAndId.name === category.toLowerCase()
              );

              const inputUnit = convertUnit(row[unit_col]);

              const outputUnit = convertUnitToListType(
                inputUnit,
                listClone.unitType
              );

              const inputWeight = isNumeric(row[weight_col]) ? row[weight_col] : '0';

              const weightInGrams = toGrams(inputWeight, inputUnit)

              const targetWeight = fromGrams(weightInGrams, outputUnit)

              const worn = stringToBool(row[worn_col]);

              const price = isNumeric(row[price_col]) ? row[price_col] : '0';

              const hyperlink = isUrl(row[url_col]) ? row[url_col] : '';

              const newGearItem: GearItem = {
                id: shortid.generate(),
                catId: '',
                name: row[name_col] || '',
                description: row[desc_col] || '',
                hyperlink,
                weight: toFixed(targetWeight),
                price,
                worn,
                consumable: worn ? false : stringToBool(row[consumable_col]),
                starred: validateStar(row[starred_col]),
                checked: stringToBool(row[checked_col]),
                unit: outputUnit,
              };

              if (categoryExistsAlreadyIndex !== -1) {
                const catId =
                  existingCategoryNames[categoryExistsAlreadyIndex].id;

                newGearItem.catId = catId;

                listClone.categories[catId].gearIds.push(newGearItem.id);

                listClone.categories[catId].gearItems[
                  newGearItem.id
                ] = newGearItem;

                continue;
              }

              const newCat: GearListCategory = {
                id: shortid.generate(),
                name: category,
                gearIds: [newGearItem.id],
                color: getNextColor(listClone.categories),
                gearItems: {},
              };

              listClone.categories[newCat.id] = newCat;

              newGearItem.catId = newCat.id;

              listClone.categoryIds.push(newCat.id);

              listClone.categories[newCat.id].gearItems[
                newGearItem.id
              ] = newGearItem;

              existingCategoryNames.push({
                name: category.toLowerCase(),
                id: newCat.id,
              });
            }

            const columnsNotFound: String[] = [];

            headers.forEach((header, index) => {
              if (!wasColumnFound[index] && header !== 'qty') {
                columnsNotFound.push(result.data[0][index]);
              }
            });

            if (columnsNotFound.length) {
              console.warn(
                'These columns are invalid: ' + columnsNotFound.join(',')
              );
            }

            if (onUploadComplete) {
              onUploadComplete(listClone);
            } else {
              dispatch(actions.updateList({ list: listClone, unsavedChanges: true }));
            }
          };

          reader.readAsText(e.target.files[0]);
        } catch (err) {
          console.error(err);
        }
      }}
      id="file-upload-button"
      style={{ display: 'none' }}
      type="file"
      name="avatar"
      accept=".csv"
    />
  );
};

export default React.memo(FileUploadInput);
