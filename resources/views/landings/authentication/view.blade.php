<x-layout>
    {{ $certificate_number }}
    {{ $long_name }}
    {{ $name }}
    {{ $image_url }}
    {{ $category }}
    {{ $type }}
    {{ $signed_by }}
    {{ $signed_at }}
    {{ $created_at }}
    @foreach($related_items as $related_item)
        {{ $related_item['long_name'] }}
    @endforeach
</x-layout>
