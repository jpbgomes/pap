<x-app-layout>
    <div class="sm:h-[85vh] flex flex-col sm:flex-row justify-center items-center mt-4 gap-3">
        <div
            class="flex flex-row sm:flex-col gap-3 h-full w-[95%] sm:w-[15%] p-4 shadow-md rounded-lg prose overflow-x-auto bg-white">
            @foreach ($open_chats as $chat)
                <a href="{{ route('chat', ['id' => $chat->id]) }}" class="no-underline">
                    <x-new-button
                        class="uppercase flex justify-center lg:justify-start items-center gap-0 h-16 w-[35vw] sm:w-full">
                        <img src="{{ $chat->profile_photo_path }}" alt="{{ $chat->name }}"
                            class="w-14 h-14 sm:w-12 sm:h-12 rounded-full object-cover ml-0 lg:ml-2">
                        <p class="hidden lg:flex text-sm lg:ml-2">{{ $chat->name }}</p>
                    </x-new-button>
                </a>
            @endforeach
        </div>

        <div class="h-full flex-1 sm:max-w-2xl flex items-center justify-center p-4 shadow-md sm:rounded-lg bg-white">
            @if (!is_numeric($id) || $id == 'direct')
                <h1>Não tens nenhuma conversa aberta de momento!</h1>
            @else
                @livewire('chat-component', ['user_id' => $id])
            @endif
        </div>
    </div>
</x-app-layout>
