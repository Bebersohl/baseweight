import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { sortItems, getDragStyle } from '../utils';
import {
  GearItem,
  UnitType,
  SortDirection,
  SortBy,
  GearListCategory,
} from '../types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import CategoryTableFooter from './CategoryTableFooter';
import CategoryTableHeader from './CategoryTableHeader';
import CategoryTableItem from './CategoryTableItem';
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: (props: any) => ({
    overflowX: props.tableScroll ? 'auto' : 'visible',
    overflowY: 'hidden',
    whiteSpace: 'nowrap',
    paddingBottom: 5,
    marginBottom: 25,
  }),
}));

interface CategoryTableProps {
  category: GearListCategory;
  categoryColor: string;
  catId: string;
  editMode: boolean;
  openHyperlinkModal: (gearItem: GearItem, catId: string) => void;
  index: number;
  lastAddedCatId: string;
  listId: string;
  showCheckboxes: boolean;
  showPrices: boolean;
  currencyCharacter: string;
  unitType: UnitType;
  sortItemsBy: SortBy;
  sortItemsDirection: SortDirection;
  totalPrice: number;
  totalWeight: number;
}

const CategoryTable: React.FC<CategoryTableProps> = props => {
  const {
    category,
    categoryColor,
    catId,
    editMode,
    openHyperlinkModal,
    index,
    lastAddedCatId,
    listId,
    showCheckboxes,
    showPrices,
    currencyCharacter,
    unitType,
    sortItemsBy,
    sortItemsDirection,
    totalPrice,
    totalWeight,
  } = props;

  const isEveryCheckboxChecked =
    category.gearIds.length === 0
      ? false
      : category.gearIds.every(gearId => category.gearItems[gearId].checked);

  const [isCategoryBoxChecked, toggleCategoryBox] = useState(
    isEveryCheckboxChecked
  );

  const tableScroll = useMediaQuery('(max-width:550px)');

  const classes = useStyles({ editMode, tableScroll });

  const [lastAddedId, setLastAddedId] = useState('');

  function renderItems() {
    const gearIds = editMode
      ? category.gearIds
      : sortItems(category, sortItemsDirection, sortItemsBy);

    const items = gearIds.map((gearId, index) => {
      const item = category.gearItems[gearId];

      const isDragDisabled = !editMode;

      return (
        <Draggable
          key={gearId}
          draggableId={item.id}
          index={index}
          isDragDisabled={isDragDisabled}
        >
          {(draggableProvided, draggableSnapshot) => (
            <div
              ref={draggableProvided.innerRef}
              {...draggableProvided.draggableProps}
              style={getDragStyle(
                draggableSnapshot.isDragging,
                draggableProvided.draggableProps.style
              )}
            >
              <CategoryTableItem
                editMode={editMode}
                categoryColor={categoryColor}
                dragHandleProps={draggableProvided.dragHandleProps}
                category={category}
                item={item}
                gearId={gearId}
                lastAddedId={lastAddedId}
                openHyperlinkModal={openHyperlinkModal}
                catId={catId}
                listId={listId}
                showCheckboxes={showCheckboxes}
                showPrices={showPrices}
                currencyCharacter={currencyCharacter}
                unitType={unitType}
                lastItem={index === gearIds.length - 1}
              />
            </div>
          )}
        </Draggable>
      );
    });

    return (
      <Droppable droppableId={catId} type="item">
        {(droppableProvided, droppableSnapshot) => (
          <div ref={droppableProvided.innerRef}>
            {items}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }

  return (
    <Draggable draggableId={catId} index={index} isDragDisabled={!editMode}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          id={catId}
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          style={getDragStyle(
            draggableSnapshot.isDragging,
            draggableProvided.draggableProps.style
          )}
        >
          <div className={classes.container}>
            <CategoryTableHeader
              editMode={editMode}
              catId={catId}
              isCategoryBoxChecked={isCategoryBoxChecked}
              toggleCategoryBox={toggleCategoryBox}
              lastAddedCatId={lastAddedCatId}
              dragHandleProps={draggableProvided.dragHandleProps}
              sortItemsBy={sortItemsBy}
              sortItemsDirection={sortItemsDirection}
              showCheckboxes={showCheckboxes}
              categoryName={category.name}
              showPrices={showPrices}
              listId={listId}
            />

            {renderItems()}

            <CategoryTableFooter
              editMode={editMode}
              unitType={unitType}
              showCheckboxes={showCheckboxes}
              showPrices={showPrices}
              currencyCharacter={currencyCharacter}
              setLastAddedId={setLastAddedId}
              listId={listId}
              totalPrice={totalPrice}
              totalWeight={totalWeight}
              catId={catId}
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(CategoryTable);