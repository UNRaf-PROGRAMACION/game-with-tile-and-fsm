const createKey = (name, id) => {
  return `${name}-${id}`;
};

export default class Obstacles {
  obstacles = new Map();

  add(name, body) {
    const key = createKey(name, body.id);
    if (this.obstacles.has(key)) {
      throw new Error("obstacle already exists at this key");
    }
    this.obstacles.set(key, body);
  }

  is(name, body) {
    const key = createKey(name, body.id);
    if (!this.obstacles.has(key)) {
      return false;
    }

    return true;
  }
}
