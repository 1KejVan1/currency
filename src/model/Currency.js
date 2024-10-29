export function Currency(id = 0, abb = "", name = "", rate = 0) {
  this.id = id;
  this.cur_name = name;
  this.abbreviation = abb;
  this.rate = rate;
}
