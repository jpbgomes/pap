<div class="w-[85vw] sm:w-full h-[75vh] sm:h-full flex flex-col items-center gap-4 overflow-hidden prose bg-white">
    <div class="w-full flex flex-col items-center gap-3 rounded-md">
        <img src="{{ $user->profile_photo_path }}" alt="{{ $user->name }}"
            class="w-20 h-20 object-cover rounded-full m-0">
        <h3 class="m-0">{{ $user->name }}</h3>
    </div>

    @if (session('success'))
        <div class="text-green-600 font-bold">
            {{ session('success') }}
        </div>
    @endif

    @if (session('error'))
        <div class="text-red-600 font-bold">
            {{ session('error') }}
        </div>
    @endif

    @if (count($messages) > 0)
        @php
            $monthTranslations = [
                1 => 'Janeiro',
                2 => 'Fevereiro',
                3 => 'Março',
                4 => 'Abril',
                5 => 'Maio',
                6 => 'Junho',
                7 => 'Julho',
                8 => 'Agosto',
                9 => 'Setembro',
                10 => 'Outubro',
                11 => 'Novembro',
                12 => 'Dezembro',
            ];

            $groupedMessages = [];
            foreach ($messages as $message) {
                $messageDate = date('d F', strtotime($message['created_at']));
                $groupedMessages[$messageDate][] = $message;
            }

            ksort($groupedMessages);
        @endphp

        <div class="w-full max-h-[50vh] flex flex-1 flex-col overflow-y-scroll rounded-md py-5 bg-gray-200">
            @foreach ($groupedMessages as $date => $messages)
                <h1 class="text-center text-lg">
                    {{ date('d', strtotime($date)) . ' ' . $monthTranslations[date('n', strtotime($date))] }}
                </h1>

                @foreach ($messages as $message)
                    @if ($message['sender'] != auth()->user()->name)
                        <div class="w-full flex items-center gap-1">
                            <div class="bg-gray-700 max-w-[80%] text-white m-1 ml-2 py-2 px-4 rounded-xl inline-block">
                                {{ $message['message'] }}
                            </div>
                        </div>
                    @else
                        <div class="w-full">
                            <div class="text-left flex justify-end">
                                <p
                                    class="bg-[#0185ea] max-w-[80%] text-white m-1 mr-2 py-2 px-4 rounded-xl inline-block">
                                    {{ $message['message'] }}
                                </p>
                            </div>
                        </div>
                    @endif
                @endforeach
            @endforeach
        </div>
    @else
        <div class="h-full flex justify-center items-center">
            <p class="text-xl m-0 text-center">Não tens mensagens com o utilizador <span
                    class="font-bold">{{ $user->name }}</span>
            </p>
        </div>
    @endif


    <form wire:submit="sendMessage()" class="flex flex-col bg-gray-200 rounded-md p-2 w-full">
        <textarea id="messageTextarea" wire:model="message" placeholder="Messagem ..."
            class="my-2 rounded-md border border-gray-300 resize-none max-h-[150px]"></textarea>

        <x-new-button type="submit">
            ENVIAR
        </x-new-button>
    </form>
</div>

<script>
    document.addEventListener("input", function(event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
    }, false);

    function autoExpand(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
</script>
