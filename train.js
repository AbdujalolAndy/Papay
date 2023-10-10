// I-Task: arrayning ichidagi 0 index qiymatni arrayning oxiriga qoyib return qilsin.
const list = [1, 2, 3, 4, 5];

function firstToEnd(list) {
  list.push(list.shift());
  return list;
}

console.log("Shift and Push=>", firstToEnd(list));
