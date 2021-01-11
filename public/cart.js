document.addEventListener('DOMContentLoaded', ()=>{
    fetch('/card/', {method: 'post'})
        .then(res=>res.json())
        .then((card)=>{
            renderCard(card)
        })


})

if (field_card != null){
    list = field_card.querySelectorAll('.js-remove');
    field_card.addEventListener('click', (e)=>{
        if (e.target.classList.contains('js-remove')){
            fetch(`/card/remove/${e.target.dataset.id}`, {
                method: 'delete'
            }).then(res=>res.json()).then(card=>renderCard(card))
        }
    })
}

renderCard = (card)=>{
    let price = 0;
    if (card.length){
        let htmls = card.map((item)=>{
            price += item.price*item.count;
            const s =
                `<tr>
                    <td>${item.title}</td>
                    <td>${item.count}</td>
                    <td><button class="btn btn-small js-remove" data-id="${item.id}">Удалить</button></td>
             </tr>`
            return s;
        })
        const html = htmls.join('');
        table_body.innerHTML = html;
        field_price.textContent = formatPrice(price);
    } else {
        field_card.innerHTML =   '<p>Ваша корзина пуста</p>'
    }
}
