var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

function configureEndpoints(app) {
	// mongoose.connect("mongodb://localhost/test");
	var pages = require('./pages');
	var api = require('./api');

	//Налаштування URL за якими буде відповідати сервер
	//Отримання списку піц
	//app.get('/api/get-pizza-list/', api.getPizzaList);
	//app.post('/api/create-order/', api.createOrder);

	app.get('/api/show-stories/', api.show);

	app.get('/api/showsorted/', api.showSorted);

	app.get('/api/showsorted-author-asc/', api.showSortedAuthorAsc);

	app.get('/api/showsorted-author-des', api.showSortedAuthorDes);

	app.get('/api/showsorted-title-des/', api.showSortedTitleDes);


	app.get('/api/show-by-description/:description', api.showByDescription);

	app.get('/api/show-by-author/:author', api.showByAuthor);

	app.get('/api/show-by-title/:title', api.showByTitle);

	app.get('/api/story/:id', api.getId);

	app.get('/api/delete-all/', api.deleteAll);

	app.get('/api/delete/:id', api.delete);

	app.get('/api/update/:id', api.update);

	app.post('/api/save-story/', api.create);




	//Сторінки
	app.get('/new-story', pages.editorPage);
	app.get('/view-story', pages.readerPage);
	app.get('/', pages.homePage);

	//Сторінка замовлення
	//app.get('/order.html', pages.orderPage);

	//Якщо не підійшов жоден url, тоді повертаємо файли з папки www
	app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {
	//Створюється застосунок
	var app = express();

	//Налаштування директорії з шаблонами
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	//Налаштування виводу в консоль списку запитів до сервера
	app.use(morgan('dev'));

	//Розбір POST запитів
	app.use(bodyParser.urlencoded({
		extended: false
	}));
	app.use(bodyParser.json());

	//Налаштовуємо сторінки
	configureEndpoints(app);

	//Запуск додатка за вказаним портом
	app.listen(port, function () {
		console.log('My Application Running on http://localhost:' + port + '/');
	});
}

exports.startServer = startServer;
