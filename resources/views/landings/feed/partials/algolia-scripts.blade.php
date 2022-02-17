<script>
            const searchClient = algoliasearch(
                '{{ config("scout.algolia.id") }}', 
                '085cc30e0d991ab2aa990615163f86c5'
                );

            const search = instantsearch({
                indexName: 'local_user_cards',
                searchClient,
            });

            // Create the render function
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

            // Create the custom widget
            const customSortBy = instantsearch.connectors.connectSortBy(renderSortBy);

            // Instantiate the custom widget
            search.addWidgets([
            customSortBy({
                container: document.querySelector('.feed-categories__sort-by'),
                items: [
                    { label: 'Most Recent', value: search.indexName},
                    { label: 'Oldest', value: 'local_user_cards_Ascending' },
                ],
            })
            ]);

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

                widgetParams.container.appendChild(input);
                widgetParams.container.appendChild(button);
                widgetParams.container.appendChild(span);
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

            // Create the custom widget
            const customHitsPerPage = instantsearch.connectors.connectHitsPerPage(
            renderHitsPerPage
            );

            // Instantiate the custom widget
            search.addWidgets([
            customHitsPerPage({
                container: document.querySelector('.hits-per-page'),
                items: [
                    { label: '24', value: 4, default: true },
                    { label: '48', value: 48 },
                    { label: '72', value: 72 },
                    { label: '96', value: 96 },
                    { label: '100', value: 100 },
                    { label: '120', value: 120 },
                ],
            })
            ]);

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
                attribute: 'grade_nickname',
            })
            ]);

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
                        style="border: ${item.isRefined ? '1px solid #20BFB8' : ''}"
                    >
                    <a
                        class="${item.isRefined ? 'feed-categories__category-name-selected' 
                        : 'feed-categories__category-name-not-selected'}"
                        href="${createURL(item.value)}"
                        data-value="${item.value}"
                    >
                    ${item.isRefined ?  '<span class="material-icons ">check</span>'
                        : ''}
                        ${item.label}
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

            const customRefinementList = instantsearch.connectors.connectRefinementList(
            renderRefinementList
            );

            search.addWidgets([
                customRefinementList({
                    container: document.querySelector('.feed-categories__refinement-list'),
                    attribute: 'card_category',
                })
            ]);

            const renderHits = (renderOptions, isFirstRender) => {
            const { hits, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = 
                `<div class="container feed-grid__container">
                        ${hits
                            .map(
                            item =>
                            `<div class="feed-grid__grid-view">
                                    <div class="feed-grid__top-section">
                                        <aside class = "feed-grid__text">
                                            <h1 class="feed-grid__card-name">${item.card_name}</h1>
                                            <p class="feed-grid__card-long-name">${item.searchable_name}</p>
                                        </aside>
                                        <aside class = "feed-grid__grade">
                                            <p class = "feed-grid__grade-nickname">${item.grade_nickname}</p>
                                            <p class = "feed-grid__overall-grade">${item.overall_grade}</p>
                                        </aside>
                                    </div>
                                    <div class="feed-grid__image-section">
                                        <img 
                                            class="feed-grid__image" 
                                            src="${item.card_image}" 
                                            alt="${item.card_name}"
                                        >
                                    </div>
                                    <div class="feed-grid__bottom-section">
                                        <p class="feed-grid__graded-date">Date Graded: 08/24/2021 at 11:24 AM</p>
                                        <p class="feed-grid__certificate">Certificate #: ${item.certificate_number}</p>
                                        <p class="feed-grid__owner-name">Owner: ${item.owner_name}</p>
                                    </div>
                            </div>`
                            )
                            .join('')}
                </div>`;
            };

            const customHits = instantsearch.connectors.connectHits(renderHits);

            search.addWidgets([
                customHits({
                    container: document.querySelector('.hits'),
                })
            ]);

            const renderHitsListView = (renderOptions, isFirstRender) => {
            const { hits, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = 
                `
                        ${hits
                            .map(
                            item =>
                            `<tr class="feed-list__table-row">
                                <td class="feed-list__table-cell feed-list__table-cell--card">
                                    <a href="" class="feed-list__table__info">
                                        <img class="feed-list__table__info-image" src="${item.card_image}" alt="${item.card_name}" width="52" />
                                        <div class="feed-list__table__info-text">
                                            <p class="feed-list__table__info-heading">${item.card_name}</p>
                                            <p class="feed-list__table__info-subheading">${item.searchable_name}</p>
                                            <p class="feed-list__table__info-date">${item.graded_at}</p>
                                        </div>
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--date">
                                    <a href="">
                                    ${item.graded_at}
                                    <br/>
                                    ${item.graded_at}
                                    </a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--certificate">
                                    <a href="">${item.certificate_number}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--owner">
                                    <a href="">${item.owner_name}</a>
                                </td>
                                <td class="feed-list__table-cell feed-list__table-cell--grade">
                                    <a href="" class="feed-list__grade">
                                        <p class="feed-list__grade__label">${item.grade_nickname}</p>
                                        <p class="feed-list__grade__value">${item.overall_grade}</p>
                                    </a>
                                </td>
                            </tr>`
                            )
                            .join('')}
                `;
            };

            const customHitsListView = instantsearch.connectors.connectHits(renderHitsListView);

            search.addWidgets([
                customHitsListView({
                    container: document.querySelector('.list-hits'),
                })
            ]);

            // Create the render function
            const renderPagination = (renderOptions, isFirstRender) => {
            const {
                pages,
                currentRefinement,
                nbPages,
                isFirstPage,
                isLastPage,
                refine,
                createURL,
            } = renderOptions;

            const container = document.querySelector('.feed-pagintion-section__pagination');

            container.innerHTML = `
                ${
                    !isFirstPage
                    ? `
                        <p>
                        <a
                            href="${createURL(currentRefinement - 1)}"
                            data-value="${currentRefinement - 1}"
                        >  <
                        </a>
                        </p>
                        `
                    : '<p>  < </p>'
                }
                    ${
                    !isLastPage
                        ? `
                        <p class="ml-4">
                            <a
                            href="${createURL(currentRefinement + 1)}"
                            data-value="${currentRefinement + 1}"
                            >
                            >
                            </a>
                        </p>
                        `
                        : '<p class="ml-4"> > </p>'
                    }
            `;

            [...container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
                });
            });
            };

            // Create the custom widget
            const customPagination = instantsearch.connectors.connectPagination(
            renderPagination
            );

            // Instantiate the custom widget
            search.addWidgets([
            customPagination({
                container: document.querySelector('.pagination'),
            })
            ]);

            // Create the render function
            const renderStats = (renderOptions, isFirstRender) => {
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
                ${query ? `Search results for <q>${query}</q>` : ''}
                <p class="feed-stats__total">${nbHits} ${query ? `Results` : `Cards`}</p>`;
            };

            const customStats = instantsearch.connectors.connectStats(renderStats);

            search.addWidgets([
            customStats({
                container: document.querySelector('.feed-stats__text'),
            })
            ]);

            const renderClearRefinements = (renderOptions, isFirstRender) => {
            const { canRefine, refine, widgetParams } = renderOptions;

            if (isFirstRender) {
                const button = document.createElement('button');
                button.textContent = 'All Categories';
                button.className = "feed-categories__clear-refinements-button";

                button.addEventListener('click', () => {
                refine();
                });

                widgetParams.container.appendChild(button);
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
                    <li class="">
                        <a
                            class="${item.isRefined ? '' 
                            : ''}"
                            href="${createURL(item.value)}"
                            data-value="${item.value}"
                        >
                        <input class="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                        type="radio" name="category_button" id="${item.value}">
                        <label class="form-check-label inline-block text-gray-800" for="${item.value}">
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

            const customMenuSelectMobile = instantsearch.connectors.connectMenu(renderMenuSelectMobile);

            search.addWidgets([
            customMenuSelectMobile({
                container: document.querySelector('.feed-categories__menu-select-mobile'),
                attribute: 'grade_nickname',
            })
            ]);

            // Create the render function
            const createDataAttribtues = refinement =>
            Object.keys(refinement)
                .map(key => `data-${key}="${refinement[key]}"`)
                .join(' ');

            const renderListItem = item => `
            <li>
                <ul>
                ${item.refinements
                    .map(
                    refinement =>
                        `<li class="feed-stats__current-refinements-list">
                        ${refinement.label}
                        <button class="feed-stats__current-refinements-button" ${createDataAttribtues(refinement)}>X</button>
                        </li>`
                    )
                    .join('')}
                </ul>
            </li>
            `;

            const renderCurrentRefinements = (renderOptions, isFirstRender) => {
            const { items, refine, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = `
                <ul>
                ${items.map(renderListItem).join('')}
                </ul>
            `;

            [...widgetParams.container.querySelectorAll('button')].forEach(element => {
                element.addEventListener('click', event => {
                const item = Object.keys(event.currentTarget.dataset).reduce(
                    (acc, key) => ({
                    ...acc,
                    [key]: event.currentTarget.dataset[key],
                    }),
                    {}
                );

                refine(item);
                });
            });
            };

            // Create the custom widget
            const customCurrentRefinements = instantsearch.connectors.connectCurrentRefinements(
            renderCurrentRefinements
            );

            // Instantiate the custom widget
            search.addWidgets([
            customCurrentRefinements({
                container: document.querySelector('.feed-stats__current-refinements'),
            })
            ]);
            search.start();

            var grid = document.getElementsByClassName("feed-grid");
            var list = document.getElementsByClassName("feed-list");
            var grid_icon = document.getElementsByClassName("feed-categories__grid-view-icon");
            var list_icon = document.getElementsByClassName("feed-categories__list-view-icon");
            var mobile_display = document.getElementsByClassName("feed-stats__sort-and-filter-mobile");
            list[0].style.display = "none";

            function listView() {
                if (list[0].style.display === "none") {
                    grid_icon[0].style.backgroundColor = "" ;
                    list_icon[0].style.backgroundColor =  "#DCDCDC";
                    list[0].style.display = "block";
                    grid[0].style.display = "none";
                }
            }
            function gridView() {
                if (grid[0].style.display === "none") {
                    grid_icon[0].style.backgroundColor =  "#DCDCDC";
                    list_icon[0].style.backgroundColor =  "";
                    grid[0].style.display = "block";
                    list[0].style.display = "none";
                }
            }
            function openFilterSort() {
                mobile_display[0].style.width = "100%";
            }

            function closeFilterSort() {
                mobile_display[0].style.width = "0%";
            }
</script>