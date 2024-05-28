<?php

namespace App\Livewire;

use App\Events\MessageSendEvent;
use App\Models\ChatMessage;
use App\Models\RacePair;
use App\Models\User;
use Database\Seeders\RaceSeeder;
use Illuminate\Http\Response;
use Livewire\Attributes\On;
use Livewire\Component;

class ChatComponent extends Component
{
    public $user;
    public $sender_id;
    public $receiver_id;
    public $message = '';
    public $messages = [];

    public function render()
    {
        return view('livewire.chat-component');
    }

    public function mount($user_id)
    {
        $this->sender_id = auth()->user()->id;
        $this->receiver_id = $user_id;

        $pairs = RacePair::with('athlete')
            ->with('guide')
            ->get();


        $isPaired = false;

        foreach ($pairs as $pair) {
            if ($pair->athlete->user->id == auth()->user()->id && $pair->guide->user->id == $user_id) {
                $isPaired = true;
                break;
            } else if ($pair->guide->user->id == auth()->user()->id && $pair->athlete->user->id == $user_id) {
                $isPaired = true;
                break;
            }
        }

        if ($isPaired) {
            $messages = ChatMessage::where(function ($query) {
                $query->where('sender_id', $this->sender_id)
                    ->where('receiver_id', $this->receiver_id);
            })->orWhere(function ($query) {
                $query->where('sender_id', $this->receiver_id)
                    ->where('receiver_id', $this->sender_id);
            })
                ->with('sender:id,name', 'receiver:id,name')
                ->get();

            foreach ($messages as $message) {
                $this->appendChatMessage($message);
            }

            $this->user = User::whereId($user_id)->first();
        } else {
            abort(Response::HTTP_NOT_FOUND);
        }
    }

    public function sendMessage()
    {
        if ($this->message !== null && $this->message !== "") {
            $chatMessage = new ChatMessage();
            $chatMessage->sender_id = $this->sender_id;
            $chatMessage->receiver_id = $this->receiver_id;
            $chatMessage->message = $this->message;
            $chatMessage->save();

            session()->flash('success', 'Mensagem enviada');

            $this->appendChatMessage($chatMessage);

            broadcast(new MessageSendEvent($chatMessage))->toOthers();

            $this->message = '';
        } else {
            session()->flash('error', 'Mensagem inválida ou vazia');
        }
    }

    #[On('echo-private:chat-channel.{sender_id},MessageSendEvent')]
    public function listenForMessage($event)
    {
        $chatMessage = ChatMessage::whereId($event['message']['id'])
            ->with('sender:id,name', 'receiver:id,name')
            ->first();

        $this->appendChatMessage($chatMessage);
    }

    public function appendChatMessage($message)
    {
        $this->messages[] = [
            'id' => $message->id,
            'message' => $message->message,
            'sender' => $message->sender->name,
            'receiver' => $message->receiver->name,
            'created_at' => $message->created_at
        ];
    }
}
