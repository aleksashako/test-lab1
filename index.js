let modal_fav = document.querySelector('.modal-fav')
let cross_fav = document.querySelector('.cross-fav')
let btn_fav = document.querySelector('.fav')

btn_fav.addEventListener('click', () => {
    modal_fav.style.display = 'flex';
})

cross_fav.addEventListener('click', () => {
    modal_fav.style.display = 'none';
})

function changeContent(page) {
    const startContent = document.getElementById('startContent');
    const contentDiv = document.getElementById('content');
    
    startContent.style.display = 'none';
    contentDiv.style.display = 'block';
    
    switch (page) {
        case 'store':
            contentDiv.innerHTML = `
                <h2>about store</h2>
                <p>welcome to the Ugly Things Store! we believe that ugly doesn't mean unwanted.</p>
            `;
            break;
        case 'new':
            contentDiv.innerHTML = `
                <h2>new arrivals</h2>
                <p>no new staff as for now(</p>
            `;
            break;
        case 'catalog':
            goBackToStart();
            return; 
        default:
            contentDiv.innerHTML = '<h2>Page not found!</h2>';
    }
}

function goBackToStart() {
    const startContent = document.getElementById('startContent');
    const contentDiv = document.getElementById('content');
    
    contentDiv.style.display = 'none';
    startContent.style.display = 'block';
}





