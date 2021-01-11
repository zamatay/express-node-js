formatPrice = (price)=>{
    return new Intl.NumberFormat('ru', {
        currency: 'rub',
        useGrouping: true,
        style: 'currency'
    }).format(price)
}

formatDate = date=>{
    return Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach((item)=>{
    item.textContent = formatPrice(item.textContent)
})

document.querySelectorAll('.date').forEach((item)=>{
    item.textContent = formatDate(item.textContent)
})

let instance = M.Tabs.init(document.querySelectorAll('.tabs'));