import demo from './demo.json';
import { db } from './db';

export async function insertDemoList() {
  try {
    await db
      .collection('gearLists')
      .doc('demo')
      .set(demo);
  } catch (err) {
    console.error(err);
  }
  console.log('Inserted demo list');
}
