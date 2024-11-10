import test from "ava";

import {addNumbers} from "../addition.js";

test("javascript knows addition", (t) => {
    const sum = addNumbers({num1: 2, num2: 2});
    t.is(sum, 4, "This is not javascript");
})