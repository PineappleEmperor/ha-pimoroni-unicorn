'''Pimoroni bitmap8 font data (font8_data.hpp, pimoroni-pico, MIT licence).

Each char: width + 5 column bytes, bit N of a column = pixel row N (LSB top).
'''

HEIGHT = 8
MAX_WIDTH = 5

WIDTHS = [3, 1, 3, 5, 4, 4, 4, 1, 3, 3, 3, 3, 2, 3, 2, 4, 4, 3, 4, 4, 4, 4, 4, 4, 4, 4, 1, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 4, 5, 4, 4, 4, 4, 4, 4, 5, 4, 4, 5, 4, 4, 4, 2, 4, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 4, 4, 3, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 4, 4, 4, 3, 1, 3, 4]

DATA = (
    b'\x00\x00\x00\x00\x00',  #  
    b'_\x00\x00\x00\x00',  # !
    b'\x03\x00\x03\x00\x00',  # "
    b'(|(|(',  # #
    b'$z/\x12\x00',  # $
    b'f\x10\x08f\x00',  # %
    b'6II|\x00',  # &
    b'\x03\x00\x00\x00\x00',  #  
    b'\x1c"A\x00\x00',  # (
    b'A"\x1c\x00\x00',  # )
    b'T8T\x00\x00',  # *
    b'\x108\x10\x00\x00',  # +
    b'\x80`\x00\x00\x00',  # ,
    b'\x10\x10\x10\x00\x00',  # -
    b'``\x00\x00\x00',  # .
    b'`\x18\x06\x01\x00',  # /
    b'>AA>\x00',  # 0
    b'B\x7f@\x00\x00',  # 1
    b'bQIF\x00',  # 2
    b'!IM3\x00',  # 3
    b'\x18\x16\x11\x7f\x00',  # 4
    b'OII1\x00',  # 5
    b'<JI0\x00',  # 6
    b'\x01a\x19\x07\x00',  # 7
    b'6II6\x00',  # 8
    b'\x06I)\x1e\x00',  # 9
    b'3\x00\x00\x00\x00',  # :
    b'\x80l\x00\x00\x00',  # ;
    b'\x10(D\x00\x00',  # <
    b'(((\x00\x00',  # =
    b'D(\x10\x00\x00',  # >
    b'\x02Q\t\x06\x00',  # ?
    b'>IU^\x00',  # @
    b'~\t\t~\x00',  # A
    b'\x7fII6\x00',  # B
    b'>AA"\x00',  # C
    b'\x7fAA>\x00',  # D
    b'\x7fIIA\x00',  # E
    b'\x7f\t\t\x01\x00',  # F
    b'>AIy\x00',  # G
    b'\x7f\x08\x08\x7f\x00',  # H
    b'A\x7fA\x00\x00',  # I
    b'0@@?\x00',  # J
    b'\x7f\x08\x14c\x00',  # K
    b'\x7f@@@\x00',  # L
    b'\x7f\x02\x04\x02\x7f',  # M
    b'\x7f\x02\x04\x7f\x00',  # N
    b'>AA>\x00',  # O
    b'\x7f\t\t\x06\x00',  # P
    b'>A!^\x00',  # Q
    b'\x7f\t\x19f\x00',  # R
    b'FII1\x00',  # S
    b'\x01\x01\x7f\x01\x01',  # T
    b'?@@?\x00',  # U
    b'\x7f@ \x1f\x00',  # V
    b'?@ @?',  # W
    b'w\x08\x08w\x00',  # X
    b'GHH?\x00',  # Y
    b'qIEC\x00',  # Z
    b'\x7fA\x00\x00\x00',  # [
    b'\x01\x06\x18`\x00',  #  
    b'A\x7f\x00\x00\x00',  # ]
    b'\x04\x02\x04\x00\x00',  # ^
    b'@@@\x00\x00',  # _
    b'\x01\x01\x00\x00\x00',  # `
    b' TTx\x00',  # a
    b'\x7fDD8\x00',  # b
    b'8DD(\x00',  # c
    b'8DD\x7f\x00',  # d
    b'8TTX\x00',  # e
    b'~\t\t\x02\x00',  # f
    b'\x18\xa4\xa4|\x00',  # g
    b'\x7f\x04\x04x\x00',  # h
    b'\x04}@\x00\x00',  # i
    b'`\x80\x80}\x00',  # j
    b'\x7f\x10(D\x00',  # k
    b'\x01\x7f@\x00\x00',  # l
    b'|\x04x\x04x',  # m
    b'|\x04\x04x\x00',  # n
    b'8DD8\x00',  # o
    b'\xfc$$\x18\x00',  # p
    b'\x18$$\xfc\x00',  # q
    b'|\x08\x04\x04\x00',  # r
    b'HTT$\x00',  # s
    b'>DD \x00',  # t
    b'<@@|\x00',  # u
    b'|@ \x1c\x00',  # v
    b'<@ @<',  # w
    b'l\x10\x10l\x00',  # x
    b'\x1c\xa0\xa0|\x00',  # y
    b'dTL\x00\x00',  # z
    b'\x08>A\x00\x00',  # {
    b'\x7f\x00\x00\x00\x00',  # |
    b'A>\x08\x00\x00',  # }
    b'\x08\x04\x08\x04\x00',  # ~
)
