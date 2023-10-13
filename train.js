// I-Task: arrayning ichidagi 0 index qiymatni arrayning oxiriga qoyib return qilsin.
const list = [];

async function firstToEnd(list) {
  try {
    if (!list[0]) {
      throw new Error("Empty List");
    } else {
      list.push(list.shift());
      return list;
    }
  } catch (err) {
    throw err;
  }
}
firstToEnd(list)
  .then((data) => console.log("Shift and Push=>", data))
  .catch((err) => console.log("Error=>", err.message));