window.onload = function () {
    fetch('http://localhost:3000/stocks/', {
        headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('bearer')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.user != null) {

                //navbar
                var loginUl = document.getElementById('login-ul');
                loginUl.innerHTML = ""
                loginUl.style.marginRight = '300px';
                var welcomeText = document.createElement("h1")
                welcomeText.innerText = `Hello ${data.user}`
                loginUl.append(welcomeText)
                var loginButton = document.getElementById('login-button');
                loginButton.textContent = 'Log out'

                //stock
                var titleTop = document.getElementById('title-top')
                titleTop.className = ""
                titleTop.textContent = "Product List"

                var tableTop = document.getElementById('table-top')
                tableTop.style.display = ''
                var tableTopBody = document.getElementById('table-top-body')
                data.stocks.forEach(rowData => {
                    const row = document.createElement('tr');

                    // Create cells for each property in the JSON object
                    Object.values(rowData).forEach((value, index) => {
                        const cell = document.createElement('td');
                        if (index === 2) {
                            // Handle the 'img' property
                            const img = document.createElement('img');
                            img.src = value;
                            img.style.maxWidth = '50px'; // Set a maximum width for the image

                            cell.appendChild(img);
                        } else {
                            // For other properties, create text nodes
                            cell.textContent = value;
                        }
                        row.appendChild(cell);
                    });
                    // Create a button element
                    const buttonCell = document.createElement('td');
                    const button = document.createElement('button');
                    button.style.fontSize = '24px';
                    button.innerHTML = '<i class="fa fa-shopping-cart"></i>';

                    // Add event listener to the button
                    button.addEventListener('click', (e) => {
                        const nameField = e.target.closest('tr').querySelector('td');
                        const name = nameField.textContent;

                        let item = data.carts.find(cart => cart.name === name)

                        if (!item) {
                            const requestData = {
                                productName: name,
                                qty: 1
                            };

                            fetch('http://localhost:3000/stocks/', {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${sessionStorage.getItem('bearer')}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(requestData)
                            })
                                .then(response => {
                                    if (response.ok) {
                                        console.log('PUT request succeeded');
                                        location.reload()
                                    } else {
                                        throw new Error('PUT request failed');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error.message);
                                });
                        }


                    });

                    buttonCell.appendChild(button);
                    row.appendChild(buttonCell);

                    // Append the row to the table body
                    tableTopBody.appendChild(row);
                });

                //shopping cart
                var titleMid = document.getElementById('title-mid')
                titleMid.textContent = "Your shopping cart"
                if (data.carts.length === 0) {
                    var titleBot = document.getElementById('title-bottom')
                    titleBot.textContent = "There is no item in your shopping cart!"
                } else {
                    var totalText = document.getElementById('total')
                    totalText.style.display = ''

                    totalText.textContent = data.total;
                    const checkoutButton = document.getElementById('checkout-button')
                    checkoutButton.style.display = ''
                    var tableBottom = document.getElementById('table-bottom')
                    tableBottom.style.display = ''

                    checkoutButton.addEventListener('click', (e) => {
                        // Handle the minus icon click event


                        const requestData = {
                            user: data.user
                        };

                        fetch('http://localhost:3000/checkout/', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${sessionStorage.getItem('bearer')}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        })
                            .then(response => {
                                if (response.ok) {
                                    console.log('POST request succeeded');
                                    alert('Purchase succeeded')
                                    location.reload()
                                } else {
                                    throw new Error('POST request failed');
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error.message);
                            });


                    });
                }



                var tableBottomBody = document.getElementById('table-bottom-body');
                data.carts.forEach(rowData => {
                    const row = document.createElement('tr');

                    // Create cells for each property in the JSON object
                    Object.values(rowData).forEach((value, index, array) => {
                        const cell = document.createElement('td');

                        if (index === 2) {
                            cell.textContent = parseFloat(rowData.price * rowData.qty).toFixed(2);
                        } else if (index === 3) {
                            const iMinus = document.createElement('i');
                            iMinus.id = `${rowData.name}-minus`;
                            iMinus.className = 'fa fa-minus';

                            const input = document.createElement('input');
                            input.type = 'text';
                            input.value = value;

                            const iPlus = document.createElement('i');
                            iPlus.id = `${rowData.name}-plus`;
                            iPlus.className = 'fa fa-plus';

                            // Add event listeners to the minus and plus icons
                            iMinus.addEventListener('click', (e) => {
                                // Handle the minus icon click event
                                const nameField = e.target.closest('tr').querySelector('td');
                                const name = nameField.textContent;
                                const inputField = e.target.closest('tr').querySelector('input');

                                const qty = inputField.value - 1
                                const requestData = {
                                    productName: name,
                                    qty: qty
                                };

                                fetch('http://localhost:3000/stocks/', {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': `Bearer ${sessionStorage.getItem('bearer')}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestData)
                                })
                                    .then(response => {
                                        if (response.ok) {
                                            console.log('PUT request succeeded');
                                            location.reload()
                                        } else {
                                            throw new Error('PUT request failed');
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error.message);
                                    });


                            });

                            iPlus.addEventListener('click', (e) => {
                                // Handle the plus icon click event
                                const nameField = e.target.closest('tr').querySelector('td');
                                const name = nameField.textContent;
                                const inputField = e.target.closest('tr').querySelector('input');

                                let item = data.stocks.find(cart => cart.name === name)

                                if (inputField.value < item.stock) {
                                    const qty = parseInt(inputField.value) + 1
                                    const requestData = {
                                        productName: name,
                                        qty: qty
                                    };

                                    fetch('http://localhost:3000/stocks/', {
                                        method: 'PUT',
                                        headers: {
                                            'Authorization': `Bearer ${sessionStorage.getItem('bearer')}`,
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(requestData)
                                    })
                                        .then(response => {
                                            if (response.ok) {
                                                console.log('PUT request succeeded');
                                                location.reload()
                                            } else {
                                                throw new Error('PUT request failed');
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Error:', error.message);
                                        });
                                } else {
                                    alert('No more quantity available!')
                                }
                            });

                            // Append the elements to the cell
                            cell.appendChild(iMinus);
                            cell.appendChild(input);
                            cell.appendChild(iPlus);
                        } else {
                            cell.textContent = value;
                        }

                        row.appendChild(cell);
                    });

                    // Append the row to the table body
                    tableBottomBody.appendChild(row);
                });


            }
        })


    // login handler
    var loginButton = document.getElementById('login-button');
    var usernameInput = document.getElementById('username-input');
    var passwordInput = document.getElementById('password-input');
    loginButton.addEventListener('click', function () {
        if (this.textContent === 'Login') {
            var url = 'http://localhost:3000/login';
            var data = {
                username: usernameInput.value,
                password: passwordInput.value
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(function (response) {
                    if (response.ok) {
                        return response.json();
                    } else {
                        console.log(response)
                        alert("Wrong username or password")
                        throw new Error('Error: ' + response.status);
                    }
                })
                .then(function (data) {
                    sessionStorage.setItem('bearer', data.accessToken)
                    location.reload()
                })
                .catch(function (error) {
                    console.log('Error:', error);
                });
        } else {
            sessionStorage.setItem('bearer', ' ')
            location.reload()
        }

    });



};


