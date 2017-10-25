#include <nan.h>
#include <v8.h>
#include <RF24/RF24.h>
#include <iostream>
#include <ctime>
#include <stdio.h>
#include <time.h>
#include <string>
#include <mutex>

using namespace Nan;
using namespace v8;

RF24* radio;
std::mutex radio_mutex; 

NAN_METHOD(Create) {
    if(info.Length()==2){
        uint8_t ce = info[0]->Uint32Value();
        uint8_t cs = info[1]->Uint32Value();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio = new RF24(ce, cs);
    }
    else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(Begin) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->begin();
}

NAN_METHOD(StartListening) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->startListening();
}

NAN_METHOD(StopListening) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->stopListening();
}

NAN_METHOD(PrintDetails) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->printDetails();
}

NAN_METHOD(PowerUp) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->powerUp();
}

NAN_METHOD(PowerDown) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->powerDown();
}

NAN_METHOD(DisableCRC) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->disableCRC();
}

NAN_METHOD(ReUseTX) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->reUseTX();
}

NAN_METHOD(TxStandBy) {
    if(info.Length()==0){
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->txStandBy();
    }
    else if(info.Length()==1){
        uint32_t timeout = info[0]->Uint32Value();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->txStandBy(timeout);
    }
    else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(SetAutoAck) {
    if(info.Length()==1){
        bool enable = info[0]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->setAutoAck(enable);
    } else if(info.Length()==1){
        uint32_t pipe = info[0]->Uint32Value();
        bool enable = info[1]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->setAutoAck(pipe, enable);
    }
    else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(EnableAckPayload) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->enableAckPayload();
}

NAN_METHOD(EnableDynamicPayloads) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->enableDynamicPayloads();
}

NAN_METHOD(DisableDynamicPayloads) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->disableDynamicPayloads();
}

NAN_METHOD(EnableDynamicAck) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->enableDynamicAck();
}

NAN_METHOD(Available) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->available());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(AvailableFull) {
    uint8_t ch;
    v8::Local<v8::Object> obj = Nan::New<v8::Object>();
    std::lock_guard<std::mutex> guard(radio_mutex);
    bool status = radio->available(&ch);
    obj->Set(Nan::New("status").ToLocalChecked(), New<Boolean>(status));
    obj->Set(Nan::New("channel").ToLocalChecked(), New<Number>(ch));
    info.GetReturnValue().Set(obj);
}

NAN_METHOD(IsChipConnected) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->isChipConnected());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(TestCarrier) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->testCarrier());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(TestRPD) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->testRPD());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(IsValid) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->isValid());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(IsAckPayloadAvailable) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->isAckPayloadAvailable());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(IsPVariant) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->isPVariant());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(RxFifoFull) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Boolean> status = Nan::New(radio->rxFifoFull());
    info.GetReturnValue().Set(status);
}

NAN_METHOD(CloseReadingPipe) {
    uint8_t pipe = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->closeReadingPipe(pipe);
}

NAN_METHOD(SetAddressWidth) {
    uint8_t a_width = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setAddressWidth(a_width);
}

NAN_METHOD(SetRetries) {
    uint8_t delay = info[0]->Uint32Value();
    uint8_t count = info[1]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setRetries(delay, count);
}

NAN_METHOD(SetChannel) {
    uint8_t channel = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setChannel(channel);
}

NAN_METHOD(SetPayloadSize) {
    uint8_t size = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setPayloadSize(size);
}

NAN_METHOD(SetPALevel) {
    uint8_t level = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setPALevel(level);
}

NAN_METHOD(EnableInterrupts) {
    bool tx_ok = info[0]->BooleanValue();
    bool tx_fail = info[1]->BooleanValue();
    bool rx_ready = info[2]->BooleanValue();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->maskIRQ(!tx_ok, !tx_fail, !rx_ready);
}

NAN_METHOD(Flush_tx) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->flush_tx());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(GetChannel) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->getChannel());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(GetPayloadSize) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->getPayloadSize());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(GetDynamicPayloadSize) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->getDynamicPayloadSize());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(GetPALevel) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->getPALevel());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(Flush_rx) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(radio->flush_rx());
    info.GetReturnValue().Set(v);
}

NAN_METHOD(Read) {
    uint8_t len = info[0]->Uint32Value();   
    v8::Local<v8::Object> buf = NewBuffer(len).ToLocalChecked();
    uint8_t* pbuf = (uint8_t*)node::Buffer::Data(buf);
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->read(pbuf, len);
    info.GetReturnValue().Set(buf);
}

NAN_METHOD(Write) {
    if(info.Length()==2) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        std::lock_guard<std::mutex> guard(radio_mutex);
        v8::Local<v8::Boolean> v = Nan::New(radio->write(_buffer, len));
        info.GetReturnValue().Set(v);
    } else if(info.Length()==3) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        bool multicast = info[2]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        v8::Local<v8::Boolean> v = Nan::New(radio->write(_buffer, len, multicast));
        info.GetReturnValue().Set(v);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(WriteFast) {
    if(info.Length()==2) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        std::lock_guard<std::mutex> guard(radio_mutex);
        v8::Local<v8::Boolean> v = Nan::New(radio->writeFast(_buffer, len));
        info.GetReturnValue().Set(v);
    } else if(info.Length()==3) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        bool multicast = info[2]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        v8::Local<v8::Boolean> v = Nan::New(radio->writeFast(_buffer, len, multicast));
        info.GetReturnValue().Set(v);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(WriteBlocking) {
    if(info.Length()==3) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        uint32_t timeout = info[2]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        v8::Local<v8::Boolean> v = Nan::New(radio->writeBlocking(_buffer, len, timeout));
        info.GetReturnValue().Set(v);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(WriteAckPayload) {
    if(info.Length()==3) {
        uint8_t pipe = info[0]->Uint32Value();
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[1]->ToObject());
        uint8_t len = info[2]->Uint32Value();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->writeAckPayload(pipe, _buffer, len);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}


NAN_METHOD(StartFastWrite) {
    if(info.Length() == 3) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        bool multicast = info[2]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->startFastWrite(_buffer, len, multicast, true);
    } else if(info.Length() == 4) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        bool multicast = info[2]->BooleanValue();
        bool startTx = info[3]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->startFastWrite(_buffer, len, multicast, startTx);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(StartWrite) {
    if(info.Length() == 3) {
        uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
        uint8_t len = info[1]->Uint32Value();
        bool multicast = info[2]->BooleanValue();
        std::lock_guard<std::mutex> guard(radio_mutex);
        radio->startFastWrite(_buffer, len, multicast, true);
    } else
        return Nan::ThrowTypeError("Wrong argument number!");
}

NAN_METHOD(GetDataRate) {
    v8::Local<v8::Int32> v = Nan::New(static_cast<int32_t>(radio->getDataRate()));
    info.GetReturnValue().Set(v);
}

NAN_METHOD(SetDataRate) {
    uint32_t speed = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setDataRate(static_cast<rf24_datarate_e>(speed));
}

NAN_METHOD(GetCRCLength) {
    std::lock_guard<std::mutex> guard(radio_mutex);
    v8::Local<v8::Int32> v = Nan::New(static_cast<int32_t>(radio->getCRCLength()));
    info.GetReturnValue().Set(v);
}

NAN_METHOD(SetCRCLength) {
    uint32_t length = info[0]->Uint32Value();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->setCRCLength(static_cast<rf24_crclength_e>(length));
}

NAN_METHOD(OpenWritingPipe) {
    uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[0]->ToObject());
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->openWritingPipe(_buffer);
}

NAN_METHOD(OpenReadingPipe) {
    uint8_t number = info[0]->Uint32Value();
    uint8_t* _buffer = (uint8_t*) node::Buffer::Data(info[1]->ToObject());
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->openReadingPipe(number, _buffer);
}

NAN_METHOD(WhatHappened) {
    bool tx_ok,tx_fail,rx_ready;
    v8::Local<v8::Object> obj = Nan::New<v8::Object>();
    std::lock_guard<std::mutex> guard(radio_mutex);
    radio->whatHappened(tx_ok,tx_fail,rx_ready);
    obj->Set(Nan::New("txOk").ToLocalChecked(), New<Boolean>(tx_ok));
    obj->Set(Nan::New("txFail").ToLocalChecked(), New<Boolean>(tx_ok));
    obj->Set(Nan::New("rxReady").ToLocalChecked(), New<Boolean>(rx_ready));
    info.GetReturnValue().Set(obj);
}

NAN_MODULE_INIT(Init){
    Nan::Set(target, New<String>("begin").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Begin)).ToLocalChecked());
    Nan::Set(target, New<String>("startListening").ToLocalChecked(), GetFunction(New<FunctionTemplate>(StartListening)).ToLocalChecked());
    Nan::Set(target, New<String>("stopListening").ToLocalChecked(), GetFunction(New<FunctionTemplate>(StopListening)).ToLocalChecked());
    Nan::Set(target, New<String>("printDetails").ToLocalChecked(), GetFunction(New<FunctionTemplate>(PrintDetails)).ToLocalChecked());
    Nan::Set(target, New<String>("powerUp").ToLocalChecked(), GetFunction(New<FunctionTemplate>(PowerUp)).ToLocalChecked());
    Nan::Set(target, New<String>("powerDown").ToLocalChecked(), GetFunction(New<FunctionTemplate>(PowerDown)).ToLocalChecked());
    Nan::Set(target, New<String>("disableCRC").ToLocalChecked(), GetFunction(New<FunctionTemplate>(DisableCRC)).ToLocalChecked());
    Nan::Set(target, New<String>("reUseTX").ToLocalChecked(), GetFunction(New<FunctionTemplate>(ReUseTX)).ToLocalChecked());
    Nan::Set(target, New<String>("txStandBy").ToLocalChecked(), GetFunction(New<FunctionTemplate>(TxStandBy)).ToLocalChecked());
    Nan::Set(target, New<String>("enableAckPayload").ToLocalChecked(), GetFunction(New<FunctionTemplate>(EnableAckPayload)).ToLocalChecked());
    Nan::Set(target, New<String>("enableDynamicPayloads").ToLocalChecked(), GetFunction(New<FunctionTemplate>(EnableDynamicPayloads)).ToLocalChecked());
    Nan::Set(target, New<String>("disableDynamicPayloads").ToLocalChecked(), GetFunction(New<FunctionTemplate>(DisableDynamicPayloads)).ToLocalChecked());
    Nan::Set(target, New<String>("isPVariant").ToLocalChecked(), GetFunction(New<FunctionTemplate>(IsPVariant)).ToLocalChecked());  
    Nan::Set(target, New<String>("available").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Available)).ToLocalChecked());   
    Nan::Set(target, New<String>("availableFull").ToLocalChecked(), GetFunction(New<FunctionTemplate>(AvailableFull)).ToLocalChecked());
    Nan::Set(target, New<String>("isChipConnected").ToLocalChecked(), GetFunction(New<FunctionTemplate>(IsChipConnected)).ToLocalChecked());
    Nan::Set(target, New<String>("testCarrier").ToLocalChecked(), GetFunction(New<FunctionTemplate>(TestCarrier)).ToLocalChecked());
    Nan::Set(target, New<String>("testRPD").ToLocalChecked(), GetFunction(New<FunctionTemplate>(TestRPD)).ToLocalChecked());
    Nan::Set(target, New<String>("isValid").ToLocalChecked(), GetFunction(New<FunctionTemplate>(IsValid)).ToLocalChecked());
    Nan::Set(target, New<String>("isAckPayloadAvailable").ToLocalChecked(), GetFunction(New<FunctionTemplate>(IsAckPayloadAvailable)).ToLocalChecked());    
    Nan::Set(target, New<String>("rxFifoFull").ToLocalChecked(), GetFunction(New<FunctionTemplate>(RxFifoFull)).ToLocalChecked());
    Nan::Set(target, New<String>("closeReadingPipe").ToLocalChecked(), GetFunction(New<FunctionTemplate>(CloseReadingPipe)).ToLocalChecked());
    Nan::Set(target, New<String>("setAddressWidth").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetAddressWidth)).ToLocalChecked());
    Nan::Set(target, New<String>("setRetries").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetRetries)).ToLocalChecked());
    Nan::Set(target, New<String>("setChannel").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetChannel)).ToLocalChecked());
    Nan::Set(target, New<String>("setPayloadSize").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetPayloadSize)).ToLocalChecked());
    Nan::Set(target, New<String>("setPALevel").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetPALevel)).ToLocalChecked());
    Nan::Set(target, New<String>("flush_tx").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Flush_tx)).ToLocalChecked());
    Nan::Set(target, New<String>("getChannel").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetChannel)).ToLocalChecked());
    Nan::Set(target, New<String>("getPayloadSize").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetPayloadSize)).ToLocalChecked());
    Nan::Set(target, New<String>("getDynamicPayloadSize").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetDynamicPayloadSize)).ToLocalChecked());
    Nan::Set(target, New<String>("getPALevel").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetPALevel)).ToLocalChecked());
    Nan::Set(target, New<String>("flush_rx").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Flush_rx)).ToLocalChecked());
    Nan::Set(target, New<String>("setAutoAck").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetAutoAck)).ToLocalChecked());
    Nan::Set(target, New<String>("read").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Read)).ToLocalChecked());
    Nan::Set(target, New<String>("write").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Write)).ToLocalChecked());
    Nan::Set(target, New<String>("writeFast").ToLocalChecked(), GetFunction(New<FunctionTemplate>(WriteFast)).ToLocalChecked());
    Nan::Set(target, New<String>("writeBlocking").ToLocalChecked(), GetFunction(New<FunctionTemplate>(WriteBlocking)).ToLocalChecked());
    Nan::Set(target, New<String>("writeAckPayload").ToLocalChecked(), GetFunction(New<FunctionTemplate>(WriteAckPayload)).ToLocalChecked());
    Nan::Set(target, New<String>("startFastWrite").ToLocalChecked(), GetFunction(New<FunctionTemplate>(StartFastWrite)).ToLocalChecked());
    Nan::Set(target, New<String>("startWrite").ToLocalChecked(), GetFunction(New<FunctionTemplate>(StartWrite)).ToLocalChecked());
    Nan::Set(target, New<String>("getDataRate").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetDataRate)).ToLocalChecked());
    Nan::Set(target, New<String>("setDataRate").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetDataRate)).ToLocalChecked());
    Nan::Set(target, New<String>("getCRCLength").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetCRCLength)).ToLocalChecked());
    Nan::Set(target, New<String>("setCRCLength").ToLocalChecked(), GetFunction(New<FunctionTemplate>(SetCRCLength)).ToLocalChecked());
    Nan::Set(target, New<String>("openReadingPipe").ToLocalChecked(), GetFunction(New<FunctionTemplate>(OpenReadingPipe)).ToLocalChecked());
    Nan::Set(target, New<String>("openWritingPipe").ToLocalChecked(), GetFunction(New<FunctionTemplate>(OpenWritingPipe)).ToLocalChecked());
    Nan::Set(target, New<String>("create").ToLocalChecked(), GetFunction(New<FunctionTemplate>(Create)).ToLocalChecked());    
    Nan::Set(target, New<String>("whatHappened").ToLocalChecked(), GetFunction(New<FunctionTemplate>(WhatHappened)).ToLocalChecked());  
    Nan::Set(target, New<String>("enableInterrupts").ToLocalChecked(), GetFunction(New<FunctionTemplate>(EnableInterrupts)).ToLocalChecked());  
}

NODE_MODULE(rf24js, Init)
