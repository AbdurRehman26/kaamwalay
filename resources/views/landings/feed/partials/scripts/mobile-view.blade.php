<script>
    let count = 0;
    
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
                    if (count >= 2)
                    {
                        count--;
                    }
                    else {
                        count++;
                    }
                document.getElementsByClassName('feed-stats__count')[0].style.background = "rgba(154, 154, 154, 1)";
                document.getElementsByClassName('feed-stats__count')[0].innerHTML = count;
                document.getElementsByClassName('feed-stats__icon')[0].innerHTML = "";
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
            const{ items, canRefine, refine, widgetParams, createURL}= renderOptions;

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
                    if (count >= 2 )
                    {
                        count--;
                    }
                    else {
                        count++;
                    }
                    document.getElementsByClassName('feed-stats__count')[0].style.background = "rgba(154, 154, 154, 1)";
                    document.getElementsByClassName('feed-stats__count')[0].innerHTML = count;
                    document.getElementsByClassName('feed-stats__icon')[0].innerHTML = "";
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
            const{ options, canRefine, currentRefinement, refine, widgetParams, createURL}= renderOptions;

            if (isFirstRender) {
                const ul = document.createElement('ul');
                widgetParams.container.appendChild(ul);
            }

            widgetParams.container.querySelector('ul').innerHTML =`
            ${options
                .map(
                item => `
                    <li>
                        <label>
                            <a
                                href="#"
                                data-value="${item.value}"
                            >
                                <input
                                    type="radio"
                                    name="${widgetParams.attribute}"
                                    value="${item.value}"
                                    ${item.value === currentRefinement ? 'checked' : ''}
                                    />
                                    ${item.label}
                            </a>
                        </label>
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

            const customSortByMobile = instantsearch.connectors.connectSortBy(renderSortByMobile);

            search.addWidgets([
            customSortByMobile({
                container: document.querySelector('#sort-by-mobile'),
                items: [
                    { label: 'Most Recent', value: '{{ config("scout.prefix") }}user_cards_Descending'},
                    { label: 'Oldest', value: '{{ config("scout.prefix") }}user_cards_Ascending' },
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
