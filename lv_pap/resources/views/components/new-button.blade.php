<button
    {{ $attributes->merge(['type' => 'submit', 'class' => 'w-full bg-[#0185ea] font-bold text-white py-2 rounded-lg']) }}>
    {{ $slot }}
</button>
