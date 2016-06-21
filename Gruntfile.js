/**
 * Created by Andriy on 10.03.2015.
 */
module.exports = function(grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),

        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify:     {
            //Загальні налаштування (grunt-browserify)
            options:      {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform:  [ require('brfs') ],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "Frontend/src/js/"
                }
            },

            //Збірка з назвою піца
            editor: {
                src:        'Frontend/src/js/editorMain.js',
                dest:       'Frontend/www/assets/js/editorMain.js'
            },
			reader: {
				src:		'Frontend/src/js/readerMain.js',
				dest:		'Frontend/www/assets/js/readerMain.js'
			},
			home: {
				src:		'Frontend/src/js/homeMain.js',
				dest:		'Frontend/www/assets/js/homeMain.js'
			}
        }
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['Frontend/src/**/*.js', 'Frontend/**/*.ejs', 'Backend/**/*.ejs', 'Backend/**/*.js'],
            //Які завдання виконувати під час зміни в файлах
            tasks: ['browserify:editor']
        }
    };


    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');


    //Список завданнь по замовчування
    grunt.registerTask('default',
        [
            'browserify:editor',
            //Інші завдання які необхідно виконати
        ]
    );

};