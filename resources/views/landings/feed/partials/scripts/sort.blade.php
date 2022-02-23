<script>
    const renderSortBy = (renderOptions, isFirstRender) => {
            const {
                options,
                currentRefinement,
                hasNoResults,
                refine,
                widgetParams,
            } = renderOptions;

            if (isFirstRender) {
                const select = document.createElement('select');
                select.className = "feed-categories__sort-by-select";

                select.addEventListener('change', event => {
                    console.log(refine(event.target.value));
                refine(event.target.value);
                });

                widgetParams.container.appendChild(select);
            }

            const select = widgetParams.container.querySelector('select');

            select.disabled = hasNoResults;

            select.innerHTML = `
                ${options
                .map(
                    option => `
                    <option
                        class="feed-categories__sort-by-options"
                        value="${option.value}"
                        ${option.value === currentRefinement ? 'selected' : ''}
                    >
                        ${option.label}
                    </option>
                    `
                )
                .join('')}
            `;
            };

            const customSortBy = instantsearch.connectors.connectSortBy(renderSortBy);

            search.addWidgets([
            customSortBy({
                container: document.querySelector('.feed-categories__sort-by'),
                items: [
                    { label: 'Most Recent', value: '{{ config("scout.prefix") }}user_cards_Descending'},
                    { label: 'Oldest', value: '{{ config("scout.prefix") }}user_cards_Ascending' },
                ],
            })
            ]);
</script>
