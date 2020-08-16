import React from 'react'

import { Input, List, message, Modal, Tooltip } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from 'react-qr-code'
import styled from 'styled-components'

import { CopyOutlined, DownloadOutlined, QrcodeOutlined } from '@ant-design/icons'

import { useKeyListFromRedux } from './selectors'

const KeyActionsStyled = styled.div`
  padding-left: 4px;
  padding-right: 0;
  span {
    padding: 4px;
    color: rgba(0, 0, 0, 0.45);
    &:hover {
      color: #40a9ff;
      cursor: pointer;
    }
  }
`

const QRCodeContainerStyled = styled.div`
  svg {
    margin: 32px 4px;
  }
`

export const KeyListItem = ({ item }) => {
  const [modal, contextHolder] = Modal.useModal()
  const showQRCodeModal = (item) =>
    modal.info({
      title: item.title,
      centered: true,
      icon: <QrcodeOutlined />,
      className: 'text-center custom-modal',
      maskClosable: true,
      content: (
        <QRCodeContainerStyled>
          <QRCode value={item.key} />
        </QRCodeContainerStyled>
      ),
    })

  const inputRef = React.createRef()

  const downloadFile = () => {
    const data = new Blob([item.key], { type: 'text/txt' })
    const csvURL = window.URL.createObjectURL(data)
    const tempLink = document.createElement('a')
    tempLink.href = csvURL
    tempLink.setAttribute('download', `${item.title}.txt`)
    tempLink.click()
  }

  return (
    <List.Item.Meta
      title={item.title}
      description={
        <div>
          <Input
            placeholder="Enter your username"
            value={item.key}
            ref={inputRef}
            suffix={
              <KeyActionsStyled>
                <Tooltip title={`Show QR Code of "${item.title}"`}>
                  <QrcodeOutlined onClick={() => showQRCodeModal(item)} />
                </Tooltip>
                <Tooltip title={`Copy "${item.title}"`}>
                  <CopyToClipboard
                    text={item.key}
                    onCopy={() => {
                      inputRef.current.select()
                      message.success({
                        key: 'copy',
                        content: `"${item.title}" has been copied`,
                      })
                    }}>
                    <CopyOutlined />
                  </CopyToClipboard>
                </Tooltip>
                <Tooltip title={`Download "${item.title}"`}>
                  <DownloadOutlined onClick={downloadFile} />
                </Tooltip>
              </KeyActionsStyled>
            }
          />
          {contextHolder}
        </div>
      }
    />
  )
}

export const AccountKeyPopup = ({ visible, closeModal }) => {
  const data = useKeyListFromRedux()
  return (
    <Modal
      footer={null}
      title="ACCOUNT BACKUP KEYS"
      visible={visible}
      onCancel={closeModal}
      onOk={closeModal}
      destroyOnClose
      closable
      className="text-center custom-modal">
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <KeyListItem item={item} />
          </List.Item>
        )}
      />
    </Modal>
  )
}