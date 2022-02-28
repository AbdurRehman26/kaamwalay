<script>
            // Create the render function
            const createDataAttribtues = refinement =>
            Object.keys(refinement)
                .map(key => `data-${key}="${refinement[key]}"`)
                .join(' ');
                
            const renderListItem = item => `
                ${item.refinements
                    .map(
                    refinement =>
                        `<li class="feed-stats__current-refinements-list">
                        ${refinement.label}
                            <button class="feed-stats__current-refinements-button" ${createDataAttribtues(refinement)}>
                                X
                            </button>
                        </li>`
                    )
                    .join('')}
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
                    count--;
                    document.getElementsByClassName('feed-stats__count')[0].innerHTML = count;
                    document.getElementsByClassName('feed-stats__icon')[0].innerHTML = "";
                    if (count <= 0 )
                    { 
                        document.getElementsByClassName('feed-stats__icon')[0].innerHTML = "filter_alt";
                        document.getElementsByClassName('feed-stats__count')[0].innerHTML = "";
                        document.getElementsByClassName('feed-stats__count')[0].style.background = "transparent";
                    }
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

            const customCurrentRefinements = instantsearch.connectors.connectCurrentRefinements(
            renderCurrentRefinements
            );

            search.addWidgets([
            customCurrentRefinements({
                container: document.querySelector('.feed-stats__current-refinements'),
            })
            ]);
</script>
