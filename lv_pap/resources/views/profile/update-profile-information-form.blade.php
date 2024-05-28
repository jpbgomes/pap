<x-form-section submit="updateProfileInformation">
    <x-slot name="title">
        {{ __('Informação do Perfil') }}
    </x-slot>

    <x-slot name="description">
        {{ __('Atualize as informações do perfil da sua conta e o endereço de email.') }}
    </x-slot>

    <x-slot name="form">
        <!-- Profile Photo -->
        @if (Laravel\Jetstream\Jetstream::managesProfilePhotos())
            <div x-data="{photoName: null, photoPreview: null}" class="col-span-6 sm:col-span-4">
                <!-- Profile Photo File Input -->
                <input type="file" id="photo" class="hidden"
                            wire:model.live="photo"
                            x-ref="photo"
                            x-on:change="
                                    photoName = $refs.photo.files[0].name;
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        photoPreview = e.target.result;
                                    };
                                    reader.readAsDataURL($refs.photo.files[0]);
                            " />

                <x-label for="photo" value="{{ __('Foto') }}" />

                <!-- Current Profile Photo -->
                <div class="mt-2" x-show="!photoPreview">
                    @if ($this->user->profile_photo_path !== null)
                        @php
                            $profilePhotoPath = $this->user->profile_photo_path;
                            $afterStorage = Str::after($profilePhotoPath, 'http://localhost/storage/');
                            $startsWithHTTP = Str::startsWith($afterStorage, ['http://', 'https://']);
                            if($startsWithHTTP) {
                                $finalUrl = $afterStorage;
                            } else {
                                $finalUrl = env('APP_URL') . '/' . ltrim($afterStorage, '/');
                            }
                        @endphp

                        <img src="{{ $finalUrl }}" alt="{{ $this->user->name }}" class="rounded-full h-20 w-20 object-cover">
                    @else
                        @php
                            $firstLetter = substr($this->user->name, 0, 1);
                            $finalUrl = "https://ui-avatars.com/api/?name=$firstLetter&color=7F9CF5&background=EBF4FF";
                        @endphp
                        <img src="{{ $finalUrl }}" alt="{{ $this->user->name }}" class="rounded-full h-20 w-20 object-cover">
                    @endif
                </div>

                <!-- New Profile Photo Preview -->
                <div class="mt-2" x-show="photoPreview" style="display: none;">
                    <span class="block rounded-full w-20 h-20 bg-cover bg-no-repeat bg-center"
                          x-bind:style="'background-image: url(\'' + photoPreview + '\');'">
                    </span>
                </div>
                
                <x-secondary-button class="mt-2 me-2" type="button" x-on:click.prevent="$refs.photo.click()">
                    {{ __('Selecionar Foto Nova') }}
                </x-secondary-button>

                @if ($this->user->profile_photo_path)
                    <x-secondary-button type="button" class="mt-2" wire:click="deleteProfilePhoto">
                        {{ __('Remover Foto') }}
                    </x-secondary-button>
                @endif

                <x-input-error for="photo" class="mt-2" />
            </div>
        @endif

        <!-- Name -->
        <div class="col-span-6 sm:col-span-4">
            <x-label for="name" value="{{ __('Nome') }}" />
            <x-input id="name" type="text" class="mt-1 block w-full" wire:model="state.name" required autocomplete="name" />
            <x-input-error for="name" class="mt-2" />
        </div>

        <!-- Email -->
        <div class="col-span-6 sm:col-span-4">
            <x-label for="email" value="{{ __('Email') }}" />
            <x-input id="email" type="email" class="mt-1 block w-full" wire:model="state.email" required autocomplete="username" />
            <x-input-error for="email" class="mt-2" />

            @if (Laravel\Fortify\Features::enabled(Laravel\Fortify\Features::emailVerification()) && ! $this->user->hasVerifiedEmail())
                <p class="text-sm mt-6">
                    {{ __('O teu email não está verificado.') }}

                    <button type="button" class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" wire:click.prevent="sendEmailVerification">
                        {{ __('Clica aqui para reenviar-mos o email.') }}
                    </button>
                </p>

                @if ($this->verificationLinkSent)
                    <p class="mt-2 font-medium text-sm text-green-600">
                        {{ __('Um novo link de verificação foi enviado para o teu enderçeo de email.') }}
                    </p>
                @endif
            @endif
        </div>
    </x-slot>

    <x-slot name="actions">
        <x-action-message class="me-3" on="saved">
            {{ __('Guardado.') }}
        </x-action-message>

        <x-button wire:loading.attr="disabled" wire:target="photo">
            {{ __('Guardar') }}
        </x-button>
    </x-slot>
</x-form-section>
