<script>
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
                <p class="feed-pagintion-section__navigation-pages">1 - ${nbPages} of ${currentRefinement+1}</p>
                ${
                    !isFirstPage
                    ? `
                        <p>
                            <a href="${createURL(currentRefinement - 1)}" data-value="${currentRefinement - 1}"> 
                                <span class="feed-pagintion-section__navigation-button material-icons">chevron_left</span>
                            </a>
                        </p>
                        `
                    : '<span class="feed-pagintion-section__navigation-button material-icons">chevron_left</span>'
                }
                    ${
                    !isLastPage
                        ? `
                        <p>
                            <a href="${createURL(currentRefinement + 1)}" data-value="${currentRefinement + 1}">
                                <span class="feed-pagintion-section__navigation-button material-icons">chevron_right</span>
                            </a>
                        </p>
                        `
                        : '<span class="feed-pagintion-section__navigation-button material-icons">chevron_right</span>'
                    }
            `;

            [...container.querySelectorAll('a')].forEach(element => {
                element.addEventListener('click', event => {
                    event.preventDefault();
                    refine(event.currentTarget.dataset.value);
                });
            });
            };

            const customPagination = instantsearch.connectors.connectPagination(
                renderPagination
            );

            search.addWidgets([
                customPagination({
                    container: document.querySelector('.pagination'),
                })
            ]);
</script>
