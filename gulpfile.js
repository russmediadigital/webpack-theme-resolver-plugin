const gulp = require("gulp"),
    merge = require('merge2');

gulp.task('build', () => {
    "use strict";

    const ts = require('gulp-typescript');

    const tsProject = ts.createProject('tsconfig.json');
    const tsResult = tsProject.src().pipe(tsProject(ts.reporter.fullReporter(true)));

    return merge([
        tsResult.dts.pipe(gulp.dest('definitions')),
        tsResult.js.pipe(gulp.dest('dist'))
    ]);
});

gulp.task('watch', () => {
    "use strict";

    const watch = require('gulp-watch');

    return watch('src/**/*.ts', { ignoreInitial: false }, () => {
        gulp.run('build');
    });
});

gulp.task('default', ['watch']);