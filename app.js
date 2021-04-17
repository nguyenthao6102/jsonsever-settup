// 	JSON server: API Server (Fake) / Mock API
//	CRUD
// 		- Create: Tạo mới -> POST
// 		- Read: Lấy dữ liệu -> GET
// 		- Update: Chỉnh sửa -> PUT / PATCH
// 		- Delete: Xóa -> DELETE
// 	Postman

// var courseApi = "http://localhost:3000/courses";

// fetch(courseApi)
// 	.then(function (response) {
// 		return response.json();
// 	})
// 	.then(function (courses) {
// 		console.log(courses);
// 	});

var courseApi = "http://localhost:3000/courses";

function start() {
	getCourses(renderCourses);
	handleCreateForm();
}

start();

// Functions

// Render Courses

function getCourses(callback) {
	fetch(courseApi)
		.then(function (response) {
			return response.json();
		})
		.then(callback);
}

function renderCourses(courses) {
	var listCoursesBlock = document.querySelector("#list-courses");
	var htmls = courses.map(function (course) {
		return `
		<li class="course-item-${course.id}">
			<h2>${course.name}</h2>
			<p>${course.description}</p>
			<button onclick="handleDeleteCourse(${course.id})">Xóa</button>
			<button onclick="handleUpdateCourse(${course.id})">Sửa</button>
		</li>`;
	});
	listCoursesBlock.innerHTML = htmls.join("");
}

// CreateCourse

function createCourse(data, callback) {
	var options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	fetch(courseApi, options)
		.then(function (response) {
			return response.json();
		})
		.then(callback);
}

function handleCreateForm() {
	var createBtn = document.querySelector("#create");
	createBtn.onclick = function () {
		var name = document.querySelector('input[name="name"]').value;
		var description = document.querySelector('input[name="description"]').value;
		var formData = {
			name: name,
			description: description,
		};
		if (name != "" && description != "") {
			createCourse(formData, function () {
				getCourses(renderCourses);
			});
		} else {
			alert("Hãy nhập đầy đủ thông tin");
		}
	};
}

// Delete course
function handleDeleteCourse(id) {
	var options = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
		},
	};
	fetch(courseApi + "/" + id, options)
		.then(function (response) {
			return response.json();
		})
		.then(function () {
			var courseItem = document.querySelector(".course-item-" + id);
			if (courseItem) {
				courseItem.remove();
			}
		});
}

// Update course

function updateCourse(id, data, callback) {
	var options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	};
	fetch(courseApi + "/" + id, options)
		.then(function (response) {
			return response.json();
		})
		.then(callback);
}

function handleUpdateCourse(id) {
	var courseItem = document.querySelector(".course-item-" + id);

	var getName = courseItem.querySelector("h2").innerText;
	var getDescription = courseItem.querySelector("p").innerText;

	var name = document.querySelector('input[name="name"]');
	var description = document.querySelector('input[name="description"]');

	name.value = getName;
	description.value = getDescription;
	if (!document.querySelector("#update")) {
		document.querySelector("#create").id = "update";
	}
	document.querySelector("#update").innerText = "Lưu";

	var updateBtn = document.querySelector("#update");
	updateBtn.onclick = function () {
		var formData = {
			name: name.value,
			description: description.value,
		};
		if (name.value != "" && description.value != "") {
			updateCourse(id, formData, function () {
				getCourses(renderCourses);
			});
		} else {
			alert("Hãy nhập đầy đủ thông tin");
		}
	};
}
