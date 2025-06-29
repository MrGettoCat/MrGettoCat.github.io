// Появление при скролле
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.work-item').forEach(item => {
    observer.observe(item);
});

// Фильтрация
const buttons = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.work-item');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        btn.classList.add('active');

        const type = btn.dataset.type;

        items.forEach(item => {
            if (type === 'all' || item.dataset.type === type) {
                item.style.display = 'block';
                setTimeout(() => item.classList.add('visible'), 50);
            } else {
                item.classList.remove('visible');
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    });
});

const subfilterBlock = document.getElementById('horizontal-subfilters');
const subfilterButtons = document.querySelectorAll('.subfilter-btn');

// Показать вложенные фильтры, если выбраны "Горизонтальные"
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;

        if (type === 'horizontal') {
            subfilterBlock.classList.add('show');
        } else {
            subfilterBlock.classList.remove('show');
        }

        // Сброс подфильтра
        subfilterButtons.forEach(sb => sb.classList.remove('active'));
        subfilterButtons[0]?.classList.add('active'); // активируем "Все"
    });
});

// Фильтрация по подтипам
subfilterButtons.forEach(subBtn => {
    subBtn.addEventListener('click', () => {
        subfilterButtons.forEach(b => b.classList.remove('active'));
        subBtn.classList.add('active');

        const subtype = subBtn.dataset.subtype;

        items.forEach(item => {
            const itemType = item.dataset.type;
            const itemSubtype = item.dataset.subtype || 'all';

            if (itemType !== 'horizontal') {
                return; // игнорируем чужие типы
            }

            if (subtype === 'all' || itemSubtype === subtype) {
                item.style.display = 'block';
                setTimeout(() => item.classList.add('visible'), 50);
            } else {
                item.classList.remove('visible');
                setTimeout(() => item.style.display = 'none', 300);
            }
        });
    });
});

