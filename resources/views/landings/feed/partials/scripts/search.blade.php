<script>
    const renderSearchBox = (renderOptions, isFirstRender) => {
    const { query, refine, clear, isSearchStalled, widgetParams } = renderOptions;

            if (isFirstRender) {
                const input = document.createElement('input');
                input.className = "feed-hero__input";

                const button = document.createElement('button');
                button.textContent = 'X';
                button.className  = "feed-hero__clear-button"

                const span = document.createElement('span');
                span.className = "feed-hero__search-icon material-icons";
                span.textContent = "search_icon";

                input.addEventListener('input', event => {
                refine(event.target.value);
                });

                button.addEventListener('click', () => {
                    clear();
                });
                
                widgetParams.container.appendChild(span);
                widgetParams.container.appendChild(input);
                widgetParams.container.appendChild(button);
            }

            widgetParams.container.querySelector('input').value = query;
            };

            const customSearchBox = instantsearch.connectors.connectSearchBox(
            renderSearchBox
            );

            search.addWidgets([
            customSearchBox({
                container: document.querySelector('.feed-hero__search-box'),
                placeholder: 'Search...',
            })
            ]);
</script>
