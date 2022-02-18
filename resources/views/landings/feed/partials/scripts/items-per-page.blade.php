<script>
const renderHitsPerPage = (renderOptions, isFirstRender) => {
            const { items, hasNoResults, refine, widgetParams } = renderOptions;

            if (isFirstRender) {
                const select = document.createElement('select');

                select.addEventListener('change', event => {
                refine(event.target.value);
                });

                widgetParams.container.appendChild(select);
            }

            const select = widgetParams.container.querySelector('select');

            select.disabled = hasNoResults;

            select.innerHTML = `
                ${items
                .map(
                    item => `
                    <option
                        value="${item.value}"
                        ${item.isRefined ? 'selected' : ''}
                    >
                        ${item.label}
                    </option>
                    `
                )
                .join('')}
            `;
            };

            const customHitsPerPage = instantsearch.connectors.connectHitsPerPage(
            renderHitsPerPage
            );

            search.addWidgets([
            customHitsPerPage({
                container: document.querySelector('.hits-per-page'),
                items: [
                    { label: '24', value: 24, default: true },
                    { label: '48', value: 48 },
                    { label: '72', value: 72 },
                    { label: '96', value: 96 },
                    { label: '100', value: 100 },
                    { label: '120', value: 120 },
                ],
            })
            ]);
</script>
