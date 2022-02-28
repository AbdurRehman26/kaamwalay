<script>
        let sortName = "Most Recent";
        let colorSort = "rgba(0, 0, 0, 0.87)";
        const renderSortBy = (renderOptions, isFirstRender) => {
        const{ options, canRefine, currentRefinement, refine, widgetParams}= renderOptions;

            widgetParams.container.innerHTML =`
            <button 
                class="feed-sort dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="margin-left:30px; color:${colorSort}" >
                <span style="margin-left:-20px;">${sortName}</span>
                <span class="material-icons feed-sort__dropdown-icon" style="position:absolute">
                    arrow_drop_down
                </span>
            </button>        
            <ul class="feed-sort__dropdown dropdown-menu hidden">
            ${options
                .map(
                item => `
                        <a
                            class="feed-sort__dropdown-li"
                            href="#"
                            data-value="${item.value}"
                            data-label="${item.label}"
                        >
                            <li 
                                class="feed-sort__dropdown-items"
                                style="color: ${item.value === currentRefinement ? 'rgba(32, 191, 184, 1)' : ''}"
                            >
                                ${item.label}
                            </li>
                        </a>
                `
                )
                .join('')}
                </ul>`;

                [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                    document.getElementsByClassName('feed-categories__sort-by-text')[0].style.color = "rgba(32, 191, 184, 1)";
                    colorSort = "rgba(32, 191, 184, 1)";
                    if (sortName === event.currentTarget.dataset.label)
                    {
                        sortName = "Most Recent";
                    }
                    else {
                        sortName = event.currentTarget.dataset.label;
                    }
                event.preventDefault();
                refine(event.currentTarget.dataset.value);
                });
            });
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
