document.querySelectorAll('.carousel-row').forEach(row => {
    const speed = parseFloat(row.dataset.speed) || 0.5;
    const direction = row.dataset.direction === 'right' ? 1 : -1;

    let position = 0;
    const gap = 24;

    const originalItems = Array.from(row.children);
    originalItems.forEach(el => row.appendChild(el.cloneNode(true)));

    const getItemWidth = () => {
        const item = row.children[0];
        const style = getComputedStyle(item);
        const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        return item.offsetWidth + gap + margin;
    };

    let ticking = false;

    function animate() {
        position += speed * direction;
        row.style.transform = `translateX(${position}px)`;

        const first = row.children[0];
        const last = row.children[row.children.length - 1];
        const itemWidth = getItemWidth();

        if (!ticking) {
            requestAnimationFrame(() => {
                // Влево (слева направо)
                if (direction === -1 && Math.abs(position) >= itemWidth) {
                    row.style.transition = 'none';
                    row.appendChild(first);
                    position += itemWidth;
                    row.style.transform = `translateX(${position}px)`;

                    // Вернуть плавность на следующий кадр
                    requestAnimationFrame(() => {
                        row.style.transition = '';
                    });
                }

                // Вправо (справа налево)
                if (direction === 1 && position >= 0) {
                    row.style.transition = 'none';
                    row.insertBefore(last, first);
                    position -= itemWidth;
                    row.style.transform = `translateX(${position}px)`;

                    requestAnimationFrame(() => {
                        row.style.transition = '';
                    });
                }

                ticking = false;
            });
            ticking = true;
        }

        requestAnimationFrame(animate);
    }

    animate();
});
