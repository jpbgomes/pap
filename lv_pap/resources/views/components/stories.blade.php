<div class="flex flex-col items-center justify-center pt-24 pb-12">
    <div class="max-w-[1140px] relative flex flex-col justify-center items-center self-center gap-4">
        <x-title text="NOTÍCIAS" />

        <div class="mt-6 flex flex-wrap justify-center gap-12 px-4 lg:px-0">
            @foreach ($stories as $story)
                <div class="bg-white px-3 py-3 shadow-md rounded-xl w-full lg:w-[400px]">
                    <div>
                        <h1 class="text-xl font-bold uppercase mb-4 text-center text-[#0185ea]">{{ $story->title }}</h1>
                        @if ($story->subtitle)
                            <h2 class="text-md font-semibold mb-4 text-[#322E40]">Subtítulo:
                                {{ $story->subtitle }}</h2>
                        @endif
                        @if ($story->description)
                            <p class="text-sm font-semibold text-[#686E73]">{{ $story->description }}</p>
                        @endif
                    </div>

                    <img src="{{ $story->image }}" class="w-full rounded-lg my-6 drop-shadow-md " alt="">

                    <a href="{{ $story->url }}" target="_blank" class="font-bold text-lg text-white">
                        <x-new-button>
                            VER DETALHES
                        </x-new-button>
                    </a>
                </div>
            @endforeach
        </div>
    </div>
</div>
