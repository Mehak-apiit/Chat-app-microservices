import { env } from '../config/env.ts';
import { logger } from '../utils/looger.ts';
import amqp, { Channel, ChannelModel } from 'amqplib';
import {
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_EVENT,
    AuthUserRegisteredEventPayload,
} from '@chatapp/common';

let connectionRef: ChannelModel | null = null;
let channel: Channel | null = null;

export const initPublisher = async () => {
    if (!env.RABBITMQ_URL) {
        logger.warn(
            'RABBITMQ_URL is not defined in the environment variables. Event publishing will be disabled.'
        );
        return;
    }

    if (channel) {
        return;
    }

    const connection = await amqp.connect(env.RABBITMQ_URL);

    connectionRef = connection;

    channel = await connection.createChannel();

    await channel.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', {
        durable: true,
    });

    connection.on('close', () => {
        logger.warn('RabbitMQ connection closed');
        channel = null;
        connectionRef = null;
    });

    connection.on('error', (err) => {
        logger.error({ err }, 'RabbitMQ connection error');
    });

    logger.info('Auth service RabbitMQ publisher initialized');
};

export const publishUserRegistered = (
    payload: AuthUserRegisteredEventPayload
) => {
    if (!channel) {
        logger.warn(
            'RabbitMQ channel is not initialized. Cannot publish message'
        );
        return;
    }

    const event = {
        type: AUTH_USER_REGISTERED_EVENT,
        payload,
        occurredAt: new Date().toISOString(),
        metadata: {
            version: 1,
        },
    };

    const published = channel.publish(
        AUTH_EVENT_EXCHANGE,
        AUTH_USER_REGISTERED_EVENT,
        Buffer.from(JSON.stringify(event)),
        {
            contentType: 'application/json',
            persistent: true,
        }
    );

    if (!published) {
        logger.error('Failed to publish user registered event');
    }
};

export const closePublisher = async () => {
    try {
        const ch = channel;

        if (ch) {
            await ch.close();
            channel = null;
        }

        const conn = connectionRef;

        if (conn) {
            await conn.close();
            connectionRef = null;
        }
    } catch (error) {
        logger.error(
            { err: error },
            'Error closing RabbitMQ connection/channel'
        );
    }
};
