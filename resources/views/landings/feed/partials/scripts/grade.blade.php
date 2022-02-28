<script>
            let gradeName = "Grade";
            let gradeIcon = "arrow_drop_down";

            const renderMenuSelect = (renderOptions, isFirstRender) => {
            const { items, canRefine, refine, widgetParams, createURL } = renderOptions;

            if (gradeName === "Grade") {
            widgetParams.container.innerHTML =`
                    <button 
                        class="feed-categories__grade dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <span style="margin-left:-20px">${gradeName}</span>
                        <span class="material-icons feed-categories__dropdown-icon" >${gradeIcon}</span>
                    </button>
                    <ul class="feed-categories__dropdown dropdown-menu hidden">
            ${items
                .map(
                item => `
                        <a
                            class="feed-categories__dropdown-li"
                            href="${createURL(item.value)}"
                            data-value="${item.value}"
                        >
                            <li class="feed-categories__dropdown-items">
                                ${item.value}
                            </li>
                        </a>
                `
                )
                .join('')}
                </ul>`;
            }
            else {
                    widgetParams.container.innerHTML =`
                    ${items.map(
                        item => `
                        ${item.value == gradeName ? `
                            <a href="${createURL(item.value)}" data-value="${item.value}">
                                <button class="feed-categories__grade-selected">
                                    <span style="margin-left: -25px;">${gradeName}</span>
                                    <span class="material-icons feed-categories__close-icon" >${gradeIcon}</span>
                                </button>
                            </a> 
                            ` : ''}`
                    )
                    .join('') 
                    }`
                }
                [...widgetParams.container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                    if (gradeName === event.currentTarget.dataset.value)
                    {
                        gradeName = "Grade";
                        gradeIcon = "arrow_drop_down";
                    }
                    else {
                        gradeName = event.currentTarget.dataset.value;
                        gradeIcon = "close";
                    }
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
