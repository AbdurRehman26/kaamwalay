<script>
                const renderMenuSelect = (renderOptions, isFirstRender) => {
            const { items, canRefine, refine, widgetParams } = renderOptions;

            if (isFirstRender) {
                const select = document.createElement('select');
                select.className = "feed-categories__grade";

                select.addEventListener('change', event => {
                refine(event.target.value);
                });

                widgetParams.container.appendChild(select);
            }

            const select = widgetParams.container.querySelector('select');

            select.disabled = !canRefine;

            select.innerHTML = `
                <option value="" class="feed-categories__grade-option">Grade</option>
                ${items
                .map(
                    item =>
                    `<option
                        class="feed-categories__grade-option"
                        value="${item.value}"
                        ${item.isRefined ? 'selected' : ''}
                    >
                        ${item.label}
                    </option>`
                )
                .join('')}
            `;
            };

            const customMenuSelect = instantsearch.connectors.connectMenu(renderMenuSelect);

            search.addWidgets([
            customMenuSelect({
                container: document.querySelector('.feed-categories__menu-select'),
                attribute: 'grade',
            })
            ]);
</script>
