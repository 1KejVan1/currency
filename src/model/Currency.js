export function Currency(id = 0, abb = "", name = "", scale = 0, rate = 0) {
  this.id = id;
  this.cur_name = name;
  this.abbreviation = abb;
  this.scale = scale;
  this.rate = rate;
}
