<script>
            const clearSpan = document.createElement('span');
            clearSpan.textContent = 'done_icon';
            clearSpan.className = " feed-categories__clear-refinements-icon material-icons";

            const buttonClear = document.createElement('button');
            buttonClear.textContent = 'All Categories';
            buttonClear.className = "feed-categories__clear-refinements-selected";
            
            const renderRefinementList = (renderOptions, isFirstRender) => {
            const {
                items,
                refine,
                createURL,
                widgetParams,
            } = renderOptions;

            if (isFirstRender) {
                const ul = document.createElement('ul');
                widgetParams.container.appendChild(ul);
            }
            widgetParams.container.querySelector('ul').innerHTML =`
            ${items
                .map(
                item => `
                    <li 
                        class="feed-categories__category-list"
                        style="border: ${item.isRefined ? '1px solid #20BFB8' : ''};
                               background: ${item.isRefined ? 'rgba(32, 191, 184, 0.08)' : ''}"
                    >
                    <a
                        class="${item.isRefined ? 'feed-categories__category-name-selected' 
                        : 'feed-categories__category-name-not-selected'}"
                        href="${createURL(item.value)}"
                        data-value="${item.value}"
                    >
                    ${item.isRefined ?  '<span class="feed-categories__icon material-icons ">check</span>'
                        : ''}
                        ${item.label}
                    </a>
                    </li>
                `
                )
                .join('')}`;

            [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                    buttonClear.className = "feed-categories__clear-refinements-not-selected"
                    clearSpan.remove();
                    event.preventDefault();
                    refine(event.currentTarget.dataset.value);
                });
            });
            };

            const customRefinementList = instantsearch.connectors.connectRefinementList(
            renderRefinementList
            );

            search.addWidgets([
                customRefinementList({
                    container: document.querySelector('.feed-categories__refinement-list'),
                    attribute: 'card_category',
                })
            ]);

            const renderClearRefinements = (renderOptions, isFirstRender) => {
            const { canRefine, refine, widgetParams } = renderOptions;

            if (isFirstRender) {
                buttonClear.addEventListener('click', () => {
                    buttonClear.className = "feed-categories__clear-refinements-selected"
                    clearSpan.textContent = 'done_icon';
                    clearSpan.className = " feed-categories__clear-refinements-icon material-icons";
                    widgetParams.container.appendChild(clearSpan);
                    refine();
                });

                widgetParams.container.appendChild(clearSpan);
                widgetParams.container.appendChild(buttonClear);
            }

            };

            const customClearRefinements = instantsearch.connectors.connectClearRefinements(
            renderClearRefinements
            );

            search.addWidgets([
            customClearRefinements({
                container: document.querySelector('.feed-categories__clear-refinements'),
                })

            ]);
</script>
