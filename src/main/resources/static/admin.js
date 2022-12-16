const tbody = document.querySelector("#tbod");
let str = "";


// отображение вкладки всех юзеров
$(document).ready(async function () {
    let users = await fetch("http://localhost:8080/admin/allUsers").then(res => res.json());
    users.forEach((u) => {
        let rol = "";
        u.roles.forEach((u) => {
            rol += u.role + "  \n";
        });
        str += `<tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.password}</td>
        <td>${u.name}</td>
        <td>${u.surName}</td>
        <td>${u.email}</td>
        <td>${rol}</td>
        <td><button class="btn btn-info editbtn" >edit</button></td>
        <td><button class="btn btn-danger delbtn" >delete</button></td>
        </tr>`;
    })
    tbody.innerHTML = str;
})

// отображение всех ролей на вкладке создания нового пользователя
$(document).ready(async function () {
    let rollist = await fetch("http://localhost:8080/admin/rollist").then(r => r.json());
    let rol = "";
    rollist.forEach((r) =>
        rol += `<option value="${r.role}">${r.role}</option>`);
        document.getElementById('selector').innerHTML = `<select name="sele" 
        onchange="console.log($('#select').val())" id="select" multiple class="form-control sel" size="3"> 
        <option value="">no role</option> ${rol} </select>`;
})

//функция активизирующая имеющиеся роли при изменении
async function rolActiv (userRol) {
    console.log(userRol);
    let rollist = await fetch("http://localhost:8080/admin/rollist").then(r => r.json());
    console.log(rollist)
    let rol = "";
    let flag;
    for (let n = 0; n < rollist.length; n++) {
        for (let i = 0; i < userRol.length; i++) {
            if (rollist[n].role === userRol[i]) {
                rol += `<option value="${rollist[n].role}" selected>${rollist[n].role}</option>`;
                flag = true;
                break;
            }
        }
        if (flag) {
            flag = false;
            continue;
        }
        rol += `<option value="${rollist[n].role}">${rollist[n].role}</option>`;
    }
    let sel = `<select name="sele" onchange="console.log($('#selectEdit').val())" id="selectEdit"  
    multiple class="form-control sel" size="3"> <option value="">no role</option>${rol}</select>`;

    document.getElementById('selectorEdit').innerHTML = sel;
}

//отображение текущего пользователя
$(document).ready(async function () {
    let principal = await fetch("http://localhost:8080/admin/current").then(r => r.json());
    for (let i = 0; i < principal.roles.length; i++) {
        if (principal.roles[i].role === 'ROLE_ADMIN') {
            return;
        }
    }
    $('#usertabl').hide();
    showPrincipal();
})

//отображение вкладки пользователя
async function showPrincipal() {
    let princ = await fetch("http://localhost:8080/admin/current").then(r => r.json());
    $('#tabl_div').hide();
    let rol = "";
    princ.roles.forEach((u) => {
        rol += u.role + "  \n"; // поправить
    });
    let strPr = `<tr>
    <td>${princ.id}</td>
    <td>${princ.username}</td>
    <td>${princ.name}</td>
    <td>${princ.surName}</td>
    <td>${princ.email}</td>
    <td>${rol}</td>
    </tr>`;
    let tab = `<h2>User information-page</h2> 
    <div class="tab-pane fade show active border" id="user_panel" role="tabpanel" aria-labelledby="home-tab">
    <div class="pl-3 pt-1 d-flex border-bottom">
    <h4>About User</h4></div><table class="table table-striped table-bordered">
    <thead>
    <th>ID</th>
    <th>User Name</th>
    <th>Name</th>
    <th>Surname</th>
    <th>Email</th>
    <th>Roles</th>
    </thead>         
    <tbody id="tbodyPrincip">${strPr}</tbody>
    </table>
    </div>
    </div>`
    document.getElementById('us_tab').innerHTML = tab;
}

//показать вкладку текущего юзера
$('.action').on('click', async function () {
    await showPrincipal();
});

// заполение верней панели навигации
$(document).ready(async function () {
    let principal = await fetch("http://localhost:8080/admin/current").then(r => r.json());
    let rol = "";
    principal.roles.forEach((r) => {
        rol += r.role + "  " //поправить
    });
    document.getElementById('name_navbar').innerHTML = `<b>${principal.email}</b>`
        + ' with roles: ' + `<b>${rol}</b>`;
})

const usernameCreateValue = document.getElementById('usernameAdd');
const passwordCreateValue = document.getElementById('passwordAdd');
const nameCreateValue = document.getElementById('nameAdd');
const surNameCreateValue = document.getElementById('surNameAdd');
const emailCreateValue = document.getElementById('emailAdd');

// сохраняет пользователя в бд
$(document).ready(async function () {
    $('.btnCreate').on('click', async function (e) {
        e.preventDefault();
        let u = await fetch('http://localhost:8080/admin/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameCreateValue.value,
                password: passwordCreateValue.value,
                name: nameCreateValue.value,
                surName: surNameCreateValue.value,
                email: emailCreateValue.value,
                roles: $('#select').val()
            })
        }).then(r => r.json());
        usernameCreateValue.value = "";
        passwordCreateValue.value = "";
        nameCreateValue.value = "";
        surNameCreateValue.value = "";
        emailCreateValue.value = "";
        document.getElementById('select').value = "";
        document.getElementById('ad_pan').click();
        let rol = "";
        u.roles.forEach((u) => {
            rol += u.role + " \n"; //поправить
        });
        row = ` <tr id="dele${u.id}"><td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.password}</td>
        <td>${u.name}</td>
        <td>${u.surName}</td>
        <td>${u.email}</td>
        <td>${rol}</td>
        <td><button class="btn btn-info editbtn">edit</button></td>
        <td><button class="btn btn-danger delbtn">delete</button></td></tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    })
})

const idFormEdit = document.getElementById('idFormEdit');
const usernameFormEdit = document.getElementById('usernameFormEdit');
const passwordFormEdit = document.getElementById('passwordFormEdit');
const nameFormEdit = document.getElementById('nameFormEdit');
const surNameFormEdit = document.getElementById('surNameFormEdit');
const emailFormEdit = document.getElementById('emailFormEdit');

//кнопка edit в модальном окне
$(document).ready(function () {
    $('#submitEdit').on('click', async function (e) {
        e.preventDefault();
        let u = await fetch('http://localhost:8080/admin/update/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: idFormEdit.value,
                username: usernameFormEdit.value,
                password: passwordFormEdit.value,
                name: nameFormEdit.value,
                surName: surNameFormEdit.value,
                email: emailFormEdit.value,
                roles: $('#selectEdit').val()
            })
        }).then(u => u.json());
        $('#editMod').modal('hide');
        showPrincipal();

    })
});

//кнопка для удаления "remove" в модалке
$(document).ready(function () {
    $('#submitDelete').on('click', async function (e) {
        e.preventDefault();
        let id = document.querySelector('#idForm').value;
        await fetch(`http://localhost:8080/admin/delete/${id}`, {
            method: 'DELETE'
        });
        $('#neMod').modal('hide');
        showPrincipal();
    });
});

const on = (element, event, selector, handle) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handle(e)
        }
    })
}

//модальное окно при изменении
on(document, 'click', '.editbtn', (e) => {
    e.preventDefault();
    const parentNode = e.target.parentNode.parentNode;
    role = parentNode.children[6].innerHTML;
    let rolesArr = role.trim().split(/\s+/);
    rolActiv(rolesArr);
    $('#idFormEdit').val(parentNode.firstElementChild.innerHTML);
    $('#usernameFormEdit').val(parentNode.children[1].innerHTML);
    $('#passwordFormEdit').val(parentNode.children[2].innerHTML);
    $('#nameFormEdit').val(parentNode.children[3].innerHTML);
    $('#surNameFormEdit').val(parentNode.children[4].innerHTML);
    $('#emailFormEdit').val(parentNode.children[5].innerHTML);
    $('#editMod').modal();
})

//модальное окно при удалении
on(document, 'click', '.delbtn', (e) => {
    e.preventDefault();
    const parentNode = e.target.parentNode.parentNode;
    $('#idForm').val(parentNode.firstElementChild.innerHTML);
    $('#usernameForm').val(parentNode.children[1].innerHTML);
    $('#passwordForm').val(parentNode.children[2].innerHTML);
    $('#nameForm').val(parentNode.children[3].innerHTML);
    $('#surNameForm').val(parentNode.children[4].innerHTML);
    $('#emailForm').val(parentNode.children[5].innerHTML);
    $('#roleForm').val(parentNode.children[6].innerHTML);
    $('#neMod').modal();
})
