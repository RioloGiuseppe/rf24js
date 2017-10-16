import {CRCLength} from './crcLength'
import {Datarate} from './datarate'
import {PALevel} from './paLevel'
import {} from 'node'

export interface Irf24js {
    /**
     * Arduino Constructor
     *
     * Creates a new instance of this driver.  Before using, you create an instance
     * and send in the unique pins that this chip is connected to.
     *
     * @param _cepin The pin attached to Chip Enable on the RF module
     * @param _cspin The pin attached to Chip Select
     */
    create( _cepin:number,  _cspin:number):void;

    /**
    * Optional Linux Constructor
    *
    * Creates a new instance of this driver.  Before using, you create an instance
    * and send in the unique pins that this chip is connected to.
    *
    * @param _cepin The pin attached to Chip Enable on the RF module
    * @param _cspin The pin attached to Chip Select
    * @param spispeed For RPi, the SPI speed in MHZ ie: BCM2835_SPI_SPEED_8MHZ
    */
    create( _cepin:number,  _cspin:number,  spispeed:number ):void;

    /**
     * Begin operation of the chip
     * 
     * Call this in setup(), before calling any other methods.
     
    /**
     * Checks if the chip is connected to the SPI bus
     */
    isChipConnected():boolean;

    /**
     * Start listening on the pipes opened for reading.
     *
     * 1. Be sure to call openReadingPipe() first.  
     * 2. Do not call write() while in this mode, without first calling stopListening().
     * 3. Call available() to check for incoming traffic, and read() to get it. 
     * 
     */
    startListening():void;

    /**
     * Stop listening for incoming messages, and switch to transmit mode.
     *
     * Do this before calling write().
     */
    stopListening():void;

    /**
     * Check whether there are bytes available to be read
     * @return True if there is a payload available, false if none is
     */
        available():boolean;


    /**
     * Check whether there are bytes available to be read
     * @return Returns an object contains the status and the channel number where are datas to read
     */
    availableFull(): {status:boolean,channel:number};

    /**
     * Read the available payload
     *
     * The size of data read is the fixed payload size, see getPayloadSize()
     *
     * @note I specifically chose 'void*' as a data type to make it easier
     * for beginners to use.  No casting needed.
     *
     * @note No longer boolean. Use available to determine if packets are
     * available. Interrupt flags are now cleared during reads instead of
     * when calling available().
     *
     * @param buf Pointer to a buffer where the data should be written
     * @param len Maximum number of bytes to read into the buffer
     *
     * @return No return value. Use available().
     */
    read(len:number):Buffer;

    /**
     * Be sure to call openWritingPipe() first to set the destination
     * of where to write to.
     *
     * This blocks until the message is successfully acknowledged by
     * the receiver or the timeout/retransmit maxima are reached.  In
     * the current configuration, the max delay here is 60-70ms.
     *
     * The maximum size of data written is the fixed payload size, see
     * getPayloadSize().  However, you can write less, and the remainder
     * will just be filled with zeroes.
     *
     * TX/RX/RT interrupt flags will be cleared every time write is called
     *
     * @param buf Pointer to the data to be sent
     * @param len Number of bytes to be sent
     *  @return True if the payload was delivered successfully false if not
     */
        write(buf:Buffer, len:number ):boolean;

    /**
     * New: Open a pipe for writing via byte array. Old addressing format retained
     * for compatibility.
     *
     * Only one writing pipe can be open at once, but you can change the address
     * you'll write to. Call stopListening() first.
     *
     * Addresses are assigned via a byte array, default is 5 byte address length
     *
     *@see setAddressWidth
        *
        * @param address The address of the pipe to open. Coordinate these pipe
        * addresses amongst nodes on the network.
        */

    openWritingPipe(address:Buffer):void;

    /**
     * Open a pipe for reading
     *
     * Up to 6 pipes can be open for reading at once.  Open all the required
     * reading pipes, and then call startListening().
     *
     * @see openWritingPipe
     * @see setAddressWidth
     *
     * @note Pipes 0 and 1 will store a full 5-byte address. Pipes 2-5 will technically 
     * only store a single byte, borrowing up to 4 additional bytes from pipe #1 per the
     * assigned address width.
     * @warning Pipes 1-5 should share the same address, except the first byte.
     * @warning Pipe 0 is also used by the writing pipe.  So if you open
     * pipe 0 for reading, and then startListening(), it will overwrite the
     * writing pipe.  Ergo, do an openWritingPipe() again before write().
     *
     * @param number Which pipe# to open, 0-5.
     * @param address The 24, 32 or 40 bit address of the pipe to open.
     */
    openReadingPipe( number:number, address:Buffer):void;

        /**@}*/
    /**
     * @name Advanced Operation
     *
     *  Methods you can use to drive the chip in more advanced ways
     */
    /**@{*/

    /**
     * Print a giant block of debugging information to stdout
     */
    printDetails():void;

    /**
     * Test whether there are bytes available to be read in the
     * FIFO buffers. 
     *
     * @param[out] pipe_num Which pipe has the payload available
     *  
     *@return True if there is a payload available, false if none is
        */
        available(pipe_num:Buffer):boolean;

    /**
     * Check if the radio needs to be read. Can be used to prevent data loss
     * @return True if all three 32-byte radio buffers are full
     */
        rxFifoFull():boolean;

    /**
     * Enter low-power mode
     *
     * To return to normal power mode, call powerUp().
     *
     * @note After calling startListening(), a basic radio will consume about 13.5mA
     * at max PA level.
     * During active transmission, the radio will consume about 11.5mA, but this will
     * be reduced to 26uA (.026mA) between sending.
     * In full powerDown mode, the radio will consume approximately 900nA (.0009mA)   
     *
     */
    powerDown():void;

    /**
     * Leave low-power mode - required for normal radio operation after calling powerDown()
     * 
     * To return to low power mode, call powerDown().
     * @note This will take up to 5ms for maximum compatibility 
     */
    powerUp():void;

    /**
    * Write for single NOACK writes. Optionally disables acknowledgements/autoretries for a single write.
    *
    * @note enableDynamicAck() must be called to enable this feature
    *
    * Can be used with enableAckPayload() to request a response
    * @see enableDynamicAck()
    * @see setAutoAck()
    * @see write()
    *
    * @param buf Pointer to the data to be sent
    * @param len Number of bytes to be sent
    * @param multicast Request ACK (0), NOACK (1)
    */
        write(   buf:Buffer, len:number,   multicast:boolean ):boolean;

    /**
     * This will not block until the 3 FIFO buffers are filled with data.
     * Once the FIFOs are full, writeFast will simply wait for success or
     * timeout, and return 1 or 0 respectively. From a user perspective, just
     * keep trying to send the same data. The library will keep auto retrying
     * the current payload using the built in functionality.
     * @warning It is important to never keep the nRF24L01 in TX mode and FIFO full for more than 4ms at a time. If the auto
     * retransmit is enabled, the nRF24L01 is never in TX mode long enough to disobey this rule. Allow the FIFO
     * to clear by issuing txStandBy() or ensure appropriate time between transmissions.
     *
     * @see txStandBy()
     * @see write()
     * @see writeBlocking()
     *
     * @param buf Pointer to the data to be sent
     * @param len Number of bytes to be sent
     * @return True if the payload was delivered successfully false if not
     */
        writeFast(buf:Buffer, len:number ):boolean;

    /**
    * WriteFast for single NOACK writes. Disables acknowledgements/autoretries for a single write.
    *
    * @note enableDynamicAck() must be called to enable this feature
    * @see enableDynamicAck()
    * @see setAutoAck()
    *
    * @param buf Pointer to the data to be sent
    * @param len Number of bytes to be sent
    * @param multicast Request ACK (0) or NOACK (1)
    */
        writeFast(buf:Buffer, len:number,multicast:boolean ):boolean;

    /**
     * This function extends the auto-retry mechanism to any specified duration.
     * It will not block until the 3 FIFO buffers are filled with data.
     * If so the library will auto retry until a new payload is written
     * or the user specified timeout period is reached.
     * @warning It is important to never keep the nRF24L01 in TX mode and FIFO full for more than 4ms at a time. If the auto
     * retransmit is enabled, the nRF24L01 is never in TX mode long enough to disobey this rule. Allow the FIFO
     * to clear by issuing txStandBy() or ensure appropriate time between transmissions.
     *
     * @note If used from within an interrupt, the interrupt should be disabled until completion, and sei(); called to enable millis().
     * @see txStandBy()
     * @see write()
     * @see writeFast()
     *
     * @param buf Pointer to the data to be sent
     * @param len Number of bytes to be sent
     * @param timeout User defined timeout in milliseconds.
     * @return True if the payload was loaded into the buffer successfully false if not
     */
        writeBlocking(   buf:Buffer, len:number, timeout:number ):boolean;

    /**
     * This function should be called as soon as transmission is finished to
     * drop the radio back to STANDBY-I mode. If not issued, the radio will
     * remain in STANDBY-II mode which, per the data sheet, is not a recommended
     * operating mode.
     *
     * @note When transmitting data in rapid succession, it is still recommended by
     * the manufacturer to drop the radio out of TX or STANDBY-II mode if there is
     * time enough between sends for the FIFOs to empty. This is not required if auto-ack
     * is enabled.
     *
     * Relies on built-in auto retry functionality.
     *
     * @see txStandBy()
     * @return True if transmission is successful
     *
     */
        txStandBy():boolean;

    /**
     * This function allows extended blocking and auto-retries per a user defined timeout
     * @note If used from within an interrupt, the interrupt should be disabled until completion, and sei(); called to enable millis().
     * @param timeout Number of milliseconds to retry failed payloads
     * @return True if transmission is successful
     *
     */
        txStandBy(timeout:number,  startTx :boolean):boolean;

    /**
     * Write an ack payload for the specified pipe
     *
     * The next time a message is received on @p pipe, the data in @p buf will
     * be sent back in the acknowledgement.
     * @see enableAckPayload()
     * @see enableDynamicPayloads()
     * @warning Only three of these can be pending at any time as there are only 3 FIFO buffers.<br> Dynamic payloads must be enabled.
     * @note Ack payloads are handled automatically by the radio chip when a payload is received. Users should generally
     * write an ack payload as soon as startListening() is called, so one is available when a regular payload is received.
     * @note Ack payloads are dynamic payloads. This only works on pipes 0&1 by default. Call 
     * enableDynamicPayloads() to enable on all pipes.
     *
     * @param pipe Which pipe# (typically 1-5) will get this response.
     * @param buf Pointer to data that is sent
     * @param len Length of the data to send, up to 32 bytes max.  Not affected
     * by the static payload set by setPayloadSize().
     */
    writeAckPayload(pipe:number,   buf:Buffer, len:number):void;

    /**
     * Determine if an ack payload was received in the most recent call to
     * write(). The regular available() can also be used.
     *
     * Call read() to retrieve the ack payload.
     *
     * @return True if an ack payload is available.
     */
        isAckPayloadAvailable():boolean;


    /**
     * Non-blocking write to the open writing pipe used for buffered writes
     *
     * @note Optimization: This function now leaves the CE pin high, so the radio
     * will remain in TX or STANDBY-II Mode until a txStandBy() command is issued. Can be used as an alternative to startWrite()
     * if writing multiple payloads at once.
     * @warning It is important to never keep the nRF24L01 in TX mode with FIFO full for more than 4ms at a time. If the auto
     * retransmit/autoAck is enabled, the nRF24L01 is never in TX mode long enough to disobey this rule. Allow the FIFO
     * to clear by issuing txStandBy() or ensure appropriate time between transmissions.
     *
     * @see write()
     * @see writeFast()
     * @see startWrite()
     * @see writeBlocking()
     *
     * For single noAck writes see:
     * @see enableDynamicAck()
     * @see setAutoAck()
     *
     * @param buf Pointer to the data to be sent
     * @param len Number of bytes to be sent
     * @param multicast Request ACK (0) or NOACK (1)
     * @return True if the payload was delivered successfully false if not
     */
    startFastWrite(   buf:Buffer, len:number,   multicast:boolean,  startTx :boolean):void;

    /**
     * Non-blocking write to the open writing pipe
     *
     * Just like write(), but it returns immediately. To find out what happened
     * to the send, catch the IRQ and then call whatHappened().
     *
     * @see write()
     * @see writeFast()
     * @see startFastWrite()
     * @see whatHappened()
     *
     * For single noAck writes see:
     * @see enableDynamicAck()
     * @see setAutoAck()
     *
     * @param buf Pointer to the data to be sent
     * @param len Number of bytes to be sent
     * @param multicast Request ACK (0) or NOACK (1)
     *
     */
    startWrite(   buf:Buffer, len:number,   multicast:boolean ):void;

    /**
     * This function is mainly used internally to take advantage of the auto payload
     * re-use functionality of the chip, but can be beneficial to users as well.
     *
     * The function will instruct the radio to re-use the data in the FIFO buffers,
     * and instructs the radio to re-send once the timeout limit has been reached.
     * Used by writeFast and writeBlocking to initiate retries when a TX failure
     * occurs. Retries are automatically initiated except with the standard write().
     * This way, data is not flushed from the buffer until switching between modes.
     *
     * @note This is to be used AFTER auto-retry fails if wanting to resend
     * using the built-in payload reuse features.
     * After issuing reUseTX(), it will keep reending the same payload forever or until
     * a payload is written to the FIFO, or a flush_tx command is given.
     */
        reUseTX():void;

    /**
     * Empty the transmit buffer. This is generally not required in standard operation.
     * May be required in specific cases after stopListening() , if operating at 250KBPS data rate.
     *
     * @return Current value of status register
     */
    flush_tx():number;

    /**
     * Test whether there was a carrier on the line for the
     * previous listening period.
     *
     * Useful to check for interference on the current channel.
     *
     * @return true if was carrier, false if not
     */
        testCarrier():boolean;

    /**
     * Test whether a signal (carrier or otherwise) greater than
     * or equal to -64dBm is present on the channel. Valid only
     * on nRF24L01P (+) hardware. On nRF24L01, use testCarrier().
     *
     * Useful to check for interference on the current channel and
     * channel hopping strategies.
     *
     *@return true if signal => -64dBm, false if not
        */
        testRPD() :boolean;

    /**
     * Test whether this is a real radio, or a mock shim for
     * debugging.  Setting either pin to 0xff is the way to
     * indicate that this is not a real radio.
     *
     * @return true if this is a legitimate radio
     */
        isValid():boolean

        /**
     * Close a pipe after it has been previously opened.
     * Can be safely called without having previously opened a pipe.
     * @param pipe Which pipe # to close, 0-5.
     */
    closeReadingPipe(  pipe :number):void;


    /**
    * Set the address width from 3 to 5 bytes (24, 32 or 40 bit)
    *
    * @param a_width The address width to use: 3,4 or 5
    */
    setAddressWidth(a_width:number):void;

    /**
     * Set the number and delay of retries upon failed submit
     *
     * @param delay How long to wait between each retry, in multiples of 250us,
     * max is 15.  0 means 250us, 15 means 4000us.
     * @param count How many retries before giving up, max 15
     */
    setRetries(delay:number,  count:number):void;

    /**
     * Set RF communication channel
     *
     * @param channel Which RF channel to communicate on, 0-125
     */
    setChannel(channel:number):void;

        /**
     * Get RF communication channel
     *
     * @return The currently configured RF Channel
     */
    getChannel():number;

    /**
     * Set Static Payload Size
     *
     * This implementation uses a pre-stablished fixed payload size for all
     * transmissions.  If this method is never called, the driver will always
     * transmit the maximum payload size (32 bytes), no matter how much
     * was sent to write().
     *
     * @todo Implement variable-sized payloads feature
     *
     * @param size The number of bytes in the payload
     */
    setPayloadSize( size:number):void;

    /**
     * Get Static Payload Size
     *
     * @see setPayloadSize()
     *
     * @return The number of bytes in the payload
     */
    getPayloadSize():number;

    /**
     * Get Dynamic Payload Size
     *
     * For dynamic payloads, this pulls the size of the payload off
     * the chip
     *
     * @note Corrupt packets are now detected and flushed per the
     * manufacturer.
     * @return Payload length of last-received dynamic payload
     */
    getDynamicPayloadSize():number;

    /**
     * Enable custom payloads on the acknowledge packets
     *
     * Ack payloads are a handy way to return data back to senders without
     * manually changing the radio modes on both units.
     *
     * @note Ack payloads are dynamic payloads. This only works on pipes 0&1 by default. Call 
     * enableDynamicPayloads() to enable on all pipes.
     */
    enableAckPayload():void;

    /**
     * Enable dynamically-sized payloads
     *
     * This way you don't always have to send large packets just to send them
     * once in a while.  This enables dynamic payloads on ALL pipes.
     *
     */
    enableDynamicPayloads():void;

    /**
     * Disable dynamically-sized payloads
     *
     * This disables dynamic payloads on ALL pipes. Since Ack Payloads
     * requires Dynamic Payloads, Ack Payloads are also disabled.
     * If dynamic payloads are later re-enabled and ack payloads are desired
     * then enableAckPayload() must be called again as well.
     *
     */
    disableDynamicPayloads():void;

    /**
     * Enable dynamic ACKs (single write multicast or unicast) for chosen messages
     *
     * @note To enable full multicast or per-pipe multicast, use setAutoAck()
     *
     * @warning This MUST be called prior to attempting single write NOACK calls
     */
    enableDynamicAck():void;

    /**
     * Determine whether the hardware is an nRF24L01+ or not.
     *
     * @return true if the hardware is nRF24L01+ (or compatible) and false
     * if its not.
     */
        isPVariant():boolean ;

    /**
     * Enable or disable auto-acknowlede packets
     *
     * This is enabled by default, so it's only needed if you want to turn
     * it off for some reason.
     *
     * @param enable Whether to enable (true) or disable (false) auto-acks
     */
    setAutoAck(enable:boolean):void;

    /**
     * Enable or disable auto-acknowlede packets on a per pipeline basis.
     *
     * AA is enabled by default, so it's only needed if you want to turn
     * it off/on for some reason on a per pipeline basis.
     *
     * @param pipe Which pipeline to modify
     * @param enable Whether to enable (true) or disable (false) auto-acks
     */
    setAutoAck( pipe:number,  enable:boolean ):void;

    /**
     * Set Power Amplifier (PA) level to one of four levels:
     * RF24_PA_MIN, RF24_PA_LOW, RF24_PA_HIGH and RF24_PA_MAX
     *
     * The power levels correspond to the following output levels respectively:
     * NRF24L01: -18dBm, -12dBm,-6dBM, and 0dBm
     *
     * SI24R1: -6dBm, 0dBm, 3dBM, and 7dBm.
     *
     * @param level Desired PA level.
     */
    setPALevel ( level :PALevel):void;

    /**
     * Fetches the current PA level.
     *
     * NRF24L01: -18dBm, -12dBm, -6dBm and 0dBm
     * SI24R1:   -6dBm, 0dBm, 3dBm, 7dBm
     *
     * @return Returns values 0 to 3 representing the PA Level.
     */
        getPALevel( ):PALevel;

    /**
     * Set the transmission data rate
     *
     * @warning setting RF24_250KBPS will fail for non-plus units
     *
     * @param speed RF24_250KBPS for 250kbs, RF24_1MBPS for 1Mbps, or RF24_2MBPS for 2Mbps
     * @return true if the change was successful
     */
        setDataRate(speed:Datarate):void;

    /**
     * Fetches the transmission data rate
     *
     * @return Returns the hardware's currently configured datarate. The value
     * is one of 250kbs, RF24_1MBPS for 1Mbps, or RF24_2MBPS, as defined in the
     * rf24_datarate_e enum.
     */
    getDataRate():Datarate ;

    /**
     * Set the CRC length
     * <br>CRC checking cannot be disabled if auto-ack is enabled
     * @param length RF24_CRC_8 for 8-bit or RF24_CRC_16 for 16-bit
     */
    setCRCLength(length:CRCLength):void;

    /**
     * Get the CRC length
     * <br>CRC checking cannot be disabled if auto-ack is enabled
     * @return RF24_CRC_DISABLED if disabled or RF24_CRC_8 for 8-bit or RF24_CRC_16 for 16-bit
     */
    getCRCLength():CRCLength;

    /**
     * Disable CRC validation
     * 
     * @warning CRC cannot be disabled if auto-ack/ESB is enabled.
     */
    disableCRC():void ;

    /**
    * The radio will generate interrupt signals when a transmission is complete,
    * a transmission fails, or a payload is received. This allows users to mask
    * those interrupts to prevent them from generating a signal on the interrupt
    * pin. Interrupts are enabled on the radio chip by default.
    *
    * @param tx_ok  Mask transmission complete interrupts
    * @param tx_fail  Mask transmit failure interrupts
    * @param rx_ready Mask payload received interrupts
    */
    maskIRQ( tx_ok:boolean, tx_fail:boolean, rx_ready:boolean):void;

    /**
     * Open a pipe for reading
     * @note For compatibility with old code only, see new function
     *
     * @warning Pipes 1-5 should share the first 32 bits.
     * Only the least significant byte should be unique, e.g.
     * @warning Pipe 0 is also used by the writing pipe.  So if you open
     * pipe 0 for reading, and then startListening(), it will overwrite the
     * writing pipe.  Ergo, do an openWritingPipe() again before write().
     *
     * @param number Which pipe# to open, 0-5.
     * @param address The 40-bit address of the pipe to open.
     */
    openReadingPipe(number:number, address:number):void;

    /**
     * Open a pipe for writing
     * @note For compatibility with old code only, see new function
     *
     * Addresses are 40-bit hex values, e.g.:
     *
     * @param address The 40-bit address of the pipe to open.
     */
    openWritingPipe(address:number):void;

    /**
     * Empty the receive buffer
     *
     * @return Current value of status register
     */
    flush_rx():number
}