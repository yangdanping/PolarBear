export default function updataItemStars(movie) {
  let stars = movie.rate,
    oncount = 0,
    offcount = 0;
  if (stars == 0) return; //0分或还没出分直接显示暂无评分
  movie.stars = {}; //为allMovie添加stars对象,存放判断星数的三个属性
  movie.stars.on = movie.stars.half = movie.stars.off = 0;
  oncount = parseInt(stars) / 2;
  offcount = 5 - parseInt(stars) / 2;
  if (parseInt(oncount)) {
    for (let i = 0; i < parseInt(oncount); i++) {
      movie.stars.on++;
    }
  }
  oncount === parseInt(oncount) + 0.5 ? movie.stars.half++ : null;
  if (offcount !== 0.5) {
    for (let i = 0; i < parseInt(offcount); i++) {
      movie.stars.off++;
    }
  }
}
