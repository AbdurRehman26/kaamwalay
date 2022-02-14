<x-layout pageClass="page--feed-list">
    <x-slot name="head">
        <script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.5.1/dist/algoliasearch-lite.umd.js" integrity="sha256-EXPXz4W6pQgfYY3yTpnDa3OH8/EPn16ciVsPQ/ypsjk=" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.8.3/dist/instantsearch.production.min.js" integrity="sha256-LAGhRRdtVoD6RLo2qDQsU2mp+XVSciKRC8XPOBWmofM=" crossorigin="anonymous"></script>
    </x-slot>
    <x-slot name="body">
        <script>
            const searchClient = algoliasearch(
                '{{ config("scout.algolia.id") }}', 
                '085cc30e0d991ab2aa990615163f86c5'
                );

            const search = instantsearch({
                indexName: 'local_user_cards',
                searchClient,
            });

            // Create a render function
            const renderSearchBox = (renderOptions, isFirstRender) => {
            const { query, refine, clear, isSearchStalled, widgetParams } = renderOptions;

            if (isFirstRender) {
                const input = document.createElement('input');
                input.className = "feed-hero__input";

                const button = document.createElement('button');
                button.textContent = 'X';

                input.addEventListener('input', event => {
                refine(event.target.value);
                });

                button.addEventListener('click', () => {
                clear();
                });

                widgetParams.container.appendChild(input);
                widgetParams.container.appendChild(button);
            }

            widgetParams.container.querySelector('input').value = query;
            };

            // create custom widget
            const customSearchBox = instantsearch.connectors.connectSearchBox(
            renderSearchBox
            );

            // instantiate custom widget
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
                    { label: '24', value: 24, default: true },
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
                select.className = "feed-list-categories__grade";

                select.addEventListener('change', event => {
                refine(event.target.value);
                });

                widgetParams.container.appendChild(select);
            }

            const select = widgetParams.container.querySelector('select');

            select.disabled = !canRefine;

            select.innerHTML = `
                <option value="" class="feed-list-categories__grade-option">Grade</option>
                ${items
                .map(
                    item =>
                    `<option
                        class="feed-list-categories__grade-option"
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
                container: document.querySelector('.feed-list-categories__menu-select'),
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
            <li 
                class="feed-list-categories__category-list"
                style="border:1px solid #20BFB8"
                    >
                    <a
                        class="feed-list-categories__category-name-selected"
                        href=""
                        data-value=""
                    >
                  <span class="material-icons ">check</span>
                       All Categories
                    </a>
            </li> 
            ${items
                .map(
                item => `
                    <li 
                        class="feed-list-categories__category-list"
                        style="border: ${item.isRefined ? '1px solid #20BFB8' : ''}"
                    >
                    <a
                        class="${item.isRefined ? 'feed-list-categories__category-name-selected' 
                        : 'feed-list-categories__category-name-not-selected'}"
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
                    container: document.querySelector('.feed-list-categories__refinement-list'),
                    attribute: 'card_category',
                })
            ]);

            const renderHits = (renderOptions, isFirstRender) => {
            const { hits, widgetParams } = renderOptions;

            widgetParams.container.innerHTML = 
                `<div class="container feed-list-grid__container">
                        ${hits
                            .map(
                            item =>
                            `<div class="feed-list-grid__grid-view">
                                    <div class="feed-list-grid__top-section">
                                        <aside class = "feed-list-grid__text">
                                            <h1 class="feed-list-grid__card-name">${item.card_name}</h1>
                                            <p class="feed-list-grid__card-long-name">${item.searchable_name}</p>
                                        </aside>
                                        <aside class = "feed-list-grid__grade">
                                            <p class = "feed-list-grid__grade-nickname">${item.grade_nickname}</p>
                                            <p class = "feed-list-grid__overall-grade">${item.overall_grade}</p>
                                        </aside>
                                    </div>
                                    <div class="feed-list-grid__image-section">
                                        <img 
                                            class="feed-list-grid__image" 
                                            src="${item.card_image}" 
                                            alt="${item.card_name}"
                                        >
                                    </div>
                                    <div class="feed-list-grid__bottom-section">
                                        <p class="feed-list-grid__graded-date">Date Graded: 08/24/2021 at 11:24 AM</p>
                                        <p class="feed-list-grid__certificate">Certificate #: ${item.certificate_number}</p>
                                        <p class="feed-list-grid__owner-name">Owner: ${item.owner_name}</p>
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
                    container: document.querySelector('.hits1'),
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

            const container = document.querySelector('.pagination');

            container.innerHTML = `
                <ul>
                ${
                    !isFirstPage
                    ? `
                        <li>
                        <a
                            href="${createURL(currentRefinement - 1)}"
                            data-value="${currentRefinement - 1}"
                        >
                            <
                        </a>
                        </li>
                        `
                    : ''
                }
                ${pages
                    .map(
                    page => `
                        <li>
                        <a
                            href="${createURL(page)}"
                            data-value="${page}"
                            style="font-weight: ${currentRefinement === page ? 'bold' : ''}"
                        >
                            ${page + 1}
                        </a>
                        </li>
                    `
                    )
                    .join('')}
                    ${
                    !isLastPage
                        ? `
                        <li>
                            <a
                            href="${createURL(currentRefinement + 1)}"
                            data-value="${currentRefinement + 1}"
                            >
                            >
                            </a>
                        </li>
                        `
                        : ''
                    }
                </ul>
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

            let count = '';

            if (areHitsSorted) {
                if (nbSortedHits > 1) {
                count = `${nbSortedHits} relevant results`;
                } else if (nbSortedHits === 1) {
                count = '1 relevant result';
                } else {
                count = 'No relevant result';
                }
                count += ` sorted out of ${nbHits}`;
            } else {
                if (nbHits > 1) {
                count += `${nbHits} results`;
                } else if (nbHits === 1) {
                count += '1 result';
                } else {
                count += 'no result';
                }
            }

            widgetParams.container.innerHTML = `
                ${query ? `Search results for <q>${query}</q>` : ''}
                <p class="feed-stats__total">${nbHits} ${query ? `Results` : `Cards`}</p>`;
            };

            // Create the custom widget
            const customStats = instantsearch.connectors.connectStats(renderStats);

            // Instantiate the custom widget
            search.addWidgets([
            customStats({
                container: document.querySelector('.feed-stats__text'),
            })
            ]);

            search.start();

            var grid = document.getElementById("gridView");
            var list = document.getElementById("listView");

            function listView() {
                if (list.style.display === "none") {
                    list.style.display = "block";
                    grid.style.display = "none";
                }
            }
            function gridView() {
                if (grid.style.display === "none") {
                    grid.style.display = "block";
                    list.style.display = "none";
                }
            }
        </script>
    </x-slot>
    <section class="feed-hero">
        <div class="container feed-hero__container">
            <div class="feed-hero__text">
                <h1 class="feed-hero__text-heading">Robograding Feed</h1>
                <h2 class="feed-hero__text-subheading">See all the cards we've graded.</h2>
                <div class="feed-hero__search-box" ></div>
            </div>
        </div>
    </section>
    <section class="feed-list-categories">
        <div class="container feed-list-categories__container">
            <div class="feed-list-categories__filters">
                <div class="feed-list-categories__refinement-list"></div>
                <div class="feed-list-categories__menu-select"></div>
            </div>
            <div class="feed-list-categories__views">
                <button class="feed-list-categories__list-view-button" onclick="listView()">
                    <span class="feed-list-categories__list-view-icon material-icons">density_small</span>
                </button>
                <button class="feed-list-categories__grid-view-button" onclick="gridView()">
                    <span class="material-icons">grid_view</span>
                </button>
            </div>
        </div>
    </section>
    <section class="feed-stats">
        <div class="container feed-stats__container">
            <div class=" feed-stats__text"></div>
            <button class="feed-stats__sort-and-filter">
                <span class="material-icons">filter_alt </span>Sort & Filter
            </button>
        </div>
    </section>
    <section class="hits feed-list-grid" style="display: block;" id="gridView">
    </section>
    <section class="feed-list" style="display:none" id="listView">
        <div class="container feed-list__container">
            <div class="feed-list__table-holder">
                <table class="feed-list__table">
                    <thead class="feed-list__table-head">
                        <tr class="feed-list__table-row">
                            <th class="feed-list__table-cell feed-list__table-cell--card">Card</th>
                            <th class="feed-list__table-cell feed-list__table-cell--date">Date Graded</th>
                            <th class="feed-list__table-cell feed-list__table-cell--certificate">Certificate #</th>
                            <th class="feed-list__table-cell feed-list__table-cell--owner">Owner</th>
                            <th class="feed-list__table-cell feed-list__table-cell--grade">Grade</th>
                        </tr>
                    </thead>
                    <tbody class="feed-list__table-body hits1 ">
                    </tbody>
                </table>
            </div>
        </div>
    </section>
    <section>
        <div>
            <p class="hits-per-page">Items per page: &nbsp;</p>
        </div>
        <div>
            <div class="pagination"></div>
        </div>
    </section>
</x-layout>
