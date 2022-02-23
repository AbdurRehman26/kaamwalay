<script>
            const renderMenuSelect = (renderOptions, isFirstRender) => {
            const { items, canRefine, refine, widgetParams, createURL } = renderOptions;

            widgetParams.container.innerHTML =`
                    <button class="feed-categories__grade dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Grade 
                        <span class="material-icons feed-categories__dropdown-icon" >arrow_drop_down</span>
                    </button>
                    <ul class="feed-categories__dropdown dropdown-menu hidden">
            ${items
                .map(
                item => `
                        <li class="feed-categories__dropdown-li">
                            <a
                                class="feed-categories__dropdown-items"
                                href="${createURL(item.value)}"
                                data-value="${item.value}"
                            >
                                ${item.value}
                            </a>
                        </li>
                `
                )
                .join('')}
                </ul>`;

                [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                    event.preventDefault();
                    refine(event.currentTarget.dataset.value);
                });
            });
            };

            const customMenuSelect = instantsearch.connectors.connectMenu(renderMenuSelect);

            search.addWidgets([
            customMenuSelect({
                container: document.querySelector('.feed-categories__menu-select'),
                attribute: 'grade',
            })
            ]);
</script>
