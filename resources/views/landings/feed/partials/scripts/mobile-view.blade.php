<script>
            const renderRefinementListMobile = (renderOptions, isFirstRender) => {
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
                <li>
                    <a
                        href="${createURL(item.value)}"
                        data-value="${item.value}"
                    >
                        <label>
                            <input
                            type="radio"
                            name="${widgetParams.attribute}"
                            value="${item.value}"
                            ${item.isRefined ? 'checked' : ''}
                            />
                            ${item.label}
                        </label>
                    </a>
                </li>
                `
                )
                .join('')}`;

            [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
                });
            });
            };

            const customRefinementListMobile = instantsearch.connectors.connectRefinementList(
            renderRefinementListMobile
            );

            search.addWidgets([
                customRefinementListMobile({
                    container: document.querySelector('.feed-categories__refinement-list-mobile'),
                    attribute: 'card_category',
                })
            ]);

            const renderMenuSelectMobile = (renderOptions, isFirstRender) => {
            const 
            { items, 
            canRefine, refine, widgetParams, createURL}
             = renderOptions;

            if (isFirstRender) {
                const ul = document.createElement('ul');
                widgetParams.container.appendChild(ul);
            }

            widgetParams.container.querySelector('ul').innerHTML =`
            ${items
                .map(
                item => `
                    <li>
                        <a
                            href="${createURL(item.value)}"
                            data-value="${item.value}"
                        >
                            <label>
                                <input
                                type="radio"
                                name="${widgetParams.attribute}"
                                value="${item.value}"
                                ${item.isRefined ? 'checked' : ''}
                                />
                                ${item.label}
                            </label>
                        </a>
                    </li>
                `
                )
                .join('')}`;

                [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
                });
            });
            }
            const customMenuSelectMobile = instantsearch.connectors.connectMenu(renderMenuSelectMobile);

            search.addWidgets([
            customMenuSelectMobile({
                container: document.querySelector('.feed-categories__menu-select-mobile'),
                attribute: 'grade',
            })
            ]);

            const renderSortByMobile = (renderOptions, isFirstRender) => {
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

            const customSortByMobile = instantsearch.connectors.connectSortBy(renderSortByMobile);

            search.addWidgets([
            customSortByMobile({
                container: document.querySelector('#sort-by-mobile'),
                items: [
                    { label: 'Most Recent', value: search.indexName},
                    { label: 'Oldest', value: 'local_user_cards_Ascending' },
                ],
            })
            ]);

            const renderStatsMobile = (renderOptions, isFirstRender) => {
            const {
                nbHits,
                areHitsSorted,
                nbSortedHits,
                processingTimeMS,
                query,
                widgetParams,
            } = renderOptions;

            if (isFirstRender) {
                return;
            }

            widgetParams.container.innerHTML = `
                <button class="feed-stats__stats-button" onclick="closeFilterSort()">
                   See ${nbHits} Results
                </button>`;
            };

            const customStatsMobile = instantsearch.connectors.connectStats(renderStatsMobile);

            search.addWidgets([
            customStatsMobile({
                container: document.querySelector('.feed-stats__mobile-stats'),
            })
            ]);
            search.start();
</script>
