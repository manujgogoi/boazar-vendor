test("null", () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test("zero", () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});

test("two plus two", () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe() and toEqual() are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

test("adding floating point numbers", () => {
  const value = 0.1 + 0.2;
  expect(value).toBeCloseTo(0.3);
});

test('There is no "I" in team', () => {
  expect("team").not.toMatch(/I/);
});

test('But there is a "stop" in Christoph', () => {
  expect("Christoph").toMatch(/stop/);
});

const names = ["Kakumoni", "Manuj", "Dipankar", "Bhaskar", "Pallav"];

test("the names list has Dipankar on it", () => {
  expect(names).toContain("Dipankar");
  expect(new Set(names)).toContain("Dipankar");
});

const compileAndroidCode = () => {
  throw new Error("You are using the wrong JDK");
};

test("compiling android goes as expected", () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);
});

// We can also use the exact error message or regexp

test("compiling android goes as expected 2", () => {
  expect(() => compileAndroidCode()).toThrow("Hello World");
  expect(() => compileAndroidCode()).toThrow(/JDK/);
});

// Asynchronous Testing

const delayedFunc = () => {
  return "I am server data";
};

const myFunction = (callback) => {
  setTimeout(delayedFunc, 5000);
  callback();
};

test("the data is 'I am server data'", (done) => {
  const callback = (data) => {
    try {
      expect(data).toBe("I am server data");
      done();
    } catch (error) {
      done(error);
    }
  };

  myFunction(callback);
});
