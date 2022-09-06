<section class="feed-view__breakdown feed-view__breakdown--front">
    <div class="container">
        <div class="feed-view__breakdown__front">
            <h4 class="feed-view__breakdown__heading">Front of Card Breakdown</h4>
            <div class="feed-view__breakdown__scores">
                <table class="feed-view__breakdown__table">
                    <tbody>
                        <tr>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Centering (Front)</p>
                                <p class="feed-view__breakdown__value">{{ $front_scan['centering'] }}</p>
                            </td>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Surface (Front)</p>
                                <p class="feed-view__breakdown__value">{{ $front_scan['surface'] }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Edges (Front)</p>
                                <p class="feed-view__breakdown__value">{{ $front_scan['edges'] }}</p>
                            </td>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Corners (Front)</p>
                                <p class="feed-view__breakdown__value">{{ $front_scan['corners'] }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="feed-view__breakdown__back">
            <h4 class="feed-view__breakdown__heading">Back of Card Breakdown</h4>
            <div class="feed-view__breakdown__scores">
                <table class="feed-view__breakdown__table">
                    <tbody>
                        <tr>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Centering (Back)</p>
                                <p class="feed-view__breakdown__value">{{ $back_scan['centering'] }}</p>
                            </td>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Surface (Back)</p>
                                <p class="feed-view__breakdown__value">{{ $back_scan['surface'] }}</p>
                            </td>
                        </tr>
                        <tr>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Edges (Back)</p>
                                <p class="feed-view__breakdown__value">{{ $back_scan['edges'] }}</p>
                            </td>
                            <td class="feed-view__breakdown__table-cell">
                                <p class="feed-view__breakdown__label">Corners (Back)</p>
                                <p class="feed-view__breakdown__value">{{ $back_scan['corners'] }}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
