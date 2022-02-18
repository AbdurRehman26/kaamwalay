<script>
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
                        > 
                        <span style="margin:0px 20px" class="material-icons">chevron_left</span>
                        </a>
                        </p>
                        `
                    : '<span style="margin:0px 20px" class="material-icons">chevron_left</span>'
                }
                    ${
                    !isLastPage
                        ? `
                        <p>
                            <a
                            href="${createURL(currentRefinement + 1)}"
                            data-value="${currentRefinement + 1}"
                            >
                            <span style="margin:0px 20px" class="material-icons">chevron_right</span>
                            </a>
                        </p>
                        `
                        : '<span style="margin:0px 20px" class="material-icons">chevron_right</span>'
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
</script>
