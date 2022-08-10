fetch("/me").then((response) => {
    response.json().then((a) => {
        console.log(a);
    });
});
