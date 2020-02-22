import { CATEGORY_COLORS } from '../frontend/src/constants';
import {
  GearItem,
  GearList,
  GearListCategory,
  GearLists,
  GearSuggestion
} from '../frontend/src/types';
import * as faker from 'faker';
import shortid from 'shortid';
import userIds from './userIds.json';
import { db } from './db';

const TEST_TEXT_LENGTH = false;
const NUMBER_OF_CATEGORIES = 7;
const NUMBER_OF_ITEMS = 50;
const NUMBER_OF_LISTS = 10;

export async function batchInsertTestSuggestions() {
  try {
    let batch = db.batch();

    const suggestions = generateGearSuggestions();

    suggestions.forEach((suggestion) => {
      batch.set(db.collection('suggestions').doc(suggestion.label), suggestion);
    });

    await batch.commit();

  } catch (err) {
    console.error(err);
  }
}

export async function batchInsertTestGearLists() {
  try {
    // Get a new write batch
    let batch = db.batch();

    const lists = generateGearLists();

    lists.forEach((list) => {
      batch.set(db.collection('gearLists').doc(list.id), list);
    });

    // Commit the batch
    await batch.commit();

  } catch (err) {
    console.error(err);
  }
}

function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getStarred() {
  const starMap = {
    0: 'red',
    1: 'green',
    2: 'blue',
    3: 'none'
  };

  const rand = getRandom(0, 4);

  return starMap[rand];
}

function generateGearItem(id, catId) {
  const worn = faker.random.boolean();
  return {
    id,
    catId,
    name: TEST_TEXT_LENGTH ? faker.lorem.sentences() : faker.lorem.words(),
    description: TEST_TEXT_LENGTH
      ? faker.lorem.sentences()
      : faker.lorem.sentence(),
    hyperlink: faker.fake('https://{{lorem.word}}.com'),
    weight: faker.finance.amount(0, 3000, 4),
    price: faker.finance.amount(0, 1000, 2),
    worn,
    consumable: worn ? false : faker.random.boolean(),
    starred: getStarred(),
    checked: faker.random.boolean(),
    unit: faker.random.boolean() ? 'g' : 'kg'
  };
}

function generateGearList(id): GearList {
  const gearCategoryIds: string[] = [];
  const gearCategories = {};

  for (let i = 1; i <= NUMBER_OF_CATEGORIES; i++) {
    const id = shortid.generate();
    gearCategories[id] = generateCategory(id, i);
    gearCategoryIds.push(id);
  }

  for (let i = 1; i <= NUMBER_OF_ITEMS; i++) {
    const categoryIndex = getRandom(1, NUMBER_OF_CATEGORIES);
    const categoryId = gearCategoryIds[categoryIndex];
    const id = shortid.generate();
    gearCategories[categoryId].gearIds.push(id);
    gearCategories[categoryId].gearItems[id] = generateGearItem(id, categoryId);
  }

  return {
    id,
    name: TEST_TEXT_LENGTH ? faker.lorem.sentences() : faker.lorem.words(),
    userId: userIds[Math.floor(Math.random() * userIds.length)],
    description: TEST_TEXT_LENGTH
      ? faker.lorem.sentences()
      : faker.lorem.sentences(),
    lastUpdated: faker.random.number({ min: 0, max: Date.now() }),
    categoryIds: gearCategoryIds,
    categories: gearCategories,
    showCheckboxes: true,
    showPrices: true,
    showDescriptions: faker.random.boolean(),
    sortCategoriesBy: 'name',
    sortCategoriesDirection: 'custom',
    sortItemsBy: 'name',
    sortItemsDirection: 'custom',
    currencyCharacter: '$',
    unitType: 'metric',
    hasUnsavedData: false
  };
}

function generateCategory(id, index): GearListCategory {
  return {
    id,
    name: TEST_TEXT_LENGTH ? faker.lorem.sentences() : faker.lorem.word(),
    gearIds: [],
    color: CATEGORY_COLORS[index - 1],
    gearItems: {}
  };
}

function generateGearLists() {
  const lists = [];
  for (let i = 1; i <= NUMBER_OF_LISTS; i++) {
    const id = shortid.generate();
    const list = generateGearList(id);
    lists.push(list);
  }

  return lists;
}

const abbreviations = [
  'EE',
  'GG',
  'MLD',
  'MB',
  'Osprey',
  'TT',
  'ULA',
  'Zpacks'
];

function generateGearSuggestions() {
  let suggestions = [];

  for (let i = 0; i < 100; i++) {
    suggestions.push(generateSuggestion());
  }

  return suggestions;
}

function generateSuggestion() {
  const abbrev = abbreviations[getRandom(0, abbreviations.length)];
  const name = faker.lorem.word();
  const attribute = faker.random.boolean() ? `(${faker.lorem.word()})` : '';
  const label = `${abbrev} ${name} ${attribute}`;
  return {
    label,
    weight: faker.finance.amount(0, 3000, 4),
    price: faker.finance.amount(0, 1000, 2),
    hyperlink: faker.fake('https://{{lorem.word}}.com'),
    serverSuggestion: true,
    unit: faker.random.boolean() ? 'g' : 'kg',
    description: '',
    worn: false,
    consumable: false,
    starred: 'none'
  };
}
