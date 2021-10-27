<tr class="pop-list__table-total-row">
    <td class="pop-list__table-cell pop-list__table-cell--series">
        <div class="pop-list__table__info-text">
            <p class="pop-list__table__info-heading">Total Population</p>
        </div>
    </td>
    <td class="pop-list__table-cell pop-list__table-cell--grade-title">
        Grade
        <br/>
        +
    </td>
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->pr, 'plusValue' => '-'])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => '-', 'plusValue' => $totalPopulation->fr])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->good, 'plusValue' => $totalPopulation->good_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->vg, 'plusValue' => $totalPopulation->vg_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->vg_ex, 'plusValue' => $totalPopulation->vg_ex_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->ex, 'plusValue' => $totalPopulation->ex_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->ex_mt, 'plusValue' => $totalPopulation->ex_mt_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->nm, 'plusValue' => $totalPopulation->nm_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->nm_mt, 'plusValue' => $totalPopulation->nm_mt_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->mint, 'plusValue' => $totalPopulation->mint_plus])
    @include('landings.pop.partials.value-cell',['href' => null, 'zeroValue' => $totalPopulation->gem_mt, 'plusValue' => '-'])

    <td class="pop-list__table-cell pop-list__table-cell--total">
        {{$totalPopulation->total}}
        <br/>
        {{$totalPopulation->total_plus}}
    </td>
</tr>