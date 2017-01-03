'use script';

const badge = require('gh-badges');
const BADGE_FONT = './Verdana.ttf';
const PT_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAABCJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE0PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4xNDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgICAgIDxkYzpzdWJqZWN0PgogICAgICAgICAgICA8cmRmOlNlcS8+CiAgICAgICAgIDwvZGM6c3ViamVjdD4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTY6MTI6MjggMTc6MTI6OTM8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPlBpeGVsbWF0b3IgMy42PC94bXA6Q3JlYXRvclRvb2w+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpyIB8IAAABZ0lEQVQoFYXSSyuEURjA8fcdRExNLoOJUuQe2RGlrFj5Dixs3DZ8EFtF1mzYsJJSFpKFGptZyLWUXHJLbq//X8wC5dSv886Z8zznnOecMPjRoigqZ6geSUQ4RyYMw2v6bAu/vwgo5LsdlbjDFfKRQAFOkCbBM33wGfgV1M3vPOzjFr3YxCNSMOkNtg2OEWRwGwxaZ/CYfgorGMcrcrCFYjQhiKEUFcigi0T99Kd4wghGsYNhpFHDnHguHw24xwPW4FmPsIoiTKAEnvkQzagy0OpZOQOdbFVfMIk4lrGEBY7xzmrOS7lVW4xBKzmEN1hJq2dVL2GyeYLcjVcUuOIF4gxapGn0YReLsFCNsA51cAcGHxhoUXpQDQddYRYzaMUYvHyvqAzGnAWuhE4MwJVr4dgcbFbWeQkMwvv89QDMtge376V3YANeVwuyD8BzfTYyuU2z+eSsnJMsVBJ/Pzn+yDYSWMF/H/kHgnmYVVG1U9gAAAAASUVORK5CYII=';

let Badge = function Badge() {
  this.text = ['build', 'passed'];
  this.colorscheme = 'green';
  this.template = 'flat';
};

Badge.prototype.setText = function(textA, textB) {
  this.text = [textA, textB];
  return this;
}

Badge.prototype.setColorscheme = function(colorscheme) {
  this.colorscheme = colorscheme;
  return this;
}

Badge.prototype.setTemplate = function(template) {
  this.template = template;
  return this;
}

Badge.prototype.getOpts = function() {
  return {
    text: this.text,
    colorscheme: this.colorscheme,
    logo: PT_LOGO,
    template: this.template
  };
}

Badge.prototype.build = function(cb) {
  let scope = this;
  badge.loadFont(BADGE_FONT, function(err) {
    badge(scope.getOpts(), cb);
  });
};

module.exports = Badge;
