export function Currency(id = 0, abb = "", name = "", rate = 0) {
  this.id = id;
  this.name = name;
  this.abbreviation = abb;
  this.rate = rate;
}
